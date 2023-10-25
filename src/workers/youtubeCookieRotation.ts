import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { request as requestHttps } from 'node:https';
import { RequestOptions, IncomingMessage } from 'node:http';

type TyoutubeDataOptions = {
    cookie?: Object;
    file?: boolean;
};

type Tcookie = {
    key: string;
    value: string;
};

/**
 * Create Worker that gonna indefinitely request fresh auth cookies from YouTube
 */
export default class YoutubeCookieRotationWorker {
    // 10 minutes
    private readonly ROTATION_INETRVAL = 2 * 60000;
    private youtubeData: TyoutubeDataOptions = { file: false };

    constructor() {
        if (!existsSync('.data/youtube.data')) {
            throw new Error('Please generate YouTube cookies file using auth.js');
        }
        this.youtubeData = JSON.parse(readFileSync('.data/youtube.data', 'utf-8'));
        this.youtubeData.file = true;

        this.startWorker();
    }

    private startWorker = async () => {
        if (!(await this.refreshCookie())) {
            throw new Error(
                'Youtube did not respond with fresh cookies. Please generate new YouTube cookies file manually using auth.js'
            );
        }
        setInterval(async () => {
            console.log(await this.refreshCookie());
        }, this.ROTATION_INETRVAL);
    };

    private refreshCookie = async (): Promise<boolean> => {
        const freshCookies = await this.requestCookieRotation();
        if (!freshCookies) return false;
        freshCookies.forEach((cookie) => {
            this.setCookie(cookie.key, cookie.value);
        });
        this.uploadCookie();
        return true;
    };

    private setCookie = (key: string, value: string): boolean => {
        if (!this.youtubeData?.cookie) return false;
        key = key.trim();
        value = value.trim();
        Object.assign(this.youtubeData.cookie, { [key]: value });
        return true;
    };

    private uploadCookie = (): void => {
        if (this.youtubeData.cookie && this.youtubeData.file) {
            writeFileSync('.data/youtube.data', JSON.stringify(this.youtubeData, undefined, 4));
        }
    };

    private getCookiesAsString = (): string | undefined => {
        let result = '';
        if (!this.youtubeData?.cookie) return undefined;
        for (const [key, value] of Object.entries(this.youtubeData.cookie)) {
            result += `${key}=${value};`;
        }
        return result;
    };

    private requestCookieRotation = async (): Promise<Tcookie[] | false> => {
        const request: IncomingMessage = await new Promise((resolve, reject) => {
            this.youtubeData = JSON.parse(readFileSync('.data/youtube.data', 'utf-8'));
            const req_options: RequestOptions = {
                host: 'youtube.com',
                path: `/watch?v=${this.generateRandomVideoId()}`,
                headers: {
                    cookie: this.getCookiesAsString(),
                },
                method: 'GET',
            };
            const req = requestHttps(req_options, resolve);
            req.end();
        });

        const newCookies: string[] | undefined = request.headers['set-cookie'];
        if (newCookies === undefined || newCookies.length < 1) return false;
        return newCookies.map((cookie) => this.extractCookieFromString(cookie));
    };

    private extractCookieFromString = (cookie: string): Tcookie => {
        const cookieRoot: string = cookie.split(';')[0];
        return {
            key: cookieRoot.split('=')[0],
            value: cookieRoot.substring(cookieRoot.indexOf('=') + 1),
        };
    };

    private generateRandomVideoId = (): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomId = '';

        for (let i = 0; i < 11; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomId += characters.charAt(randomIndex);
        }

        return randomId;
    };
}
