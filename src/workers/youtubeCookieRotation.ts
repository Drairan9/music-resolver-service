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
    private readonly ROTATION_INETRVAL = 10 * 60000;
    private youtubeData: TyoutubeDataOptions = { file: false };
    private privateCookie: string = '';

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
        writeFileSync('.data/youtube.data', JSON.stringify(this.youtubeData, undefined, 4));
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
            const req_options: RequestOptions = {
                host: 'accounts.youtube.com',
                path: '/RotateCookies',
                headers: {
                    'content-type': 'application/json',
                    cookie: this.getCookiesAsString(),
                },
                method: 'POST',
            };
            const post_data = '[null,"-8202410111774881648",1]';
            const req = requestHttps(req_options, resolve);
            req.write(post_data);
            req.end();
        });
        if (request.statusCode !== 200) return false;

        console.table({
            ID: 'COOKIE ROTATION DEBUG',
            STATUS: `${request.statusCode} - ${request.statusMessage}`,
            TIMESTAMP: new Date().toLocaleString(),
        });

        const newCookies: string[] | undefined = request.headers['set-cookie'];
        let splittedCookies: Tcookie[] = [];
        console.log(newCookies);
        if (newCookies === undefined || newCookies.length < 1) return false;

        newCookies.forEach((cookie) => {
            const extracted = this.extractCookiesFromString(cookie);
            splittedCookies.push(...extracted);
        });

        return splittedCookies;
    };

    private extractCookiesFromString = (cookie: string): Tcookie[] => {
        const cookiesRoot: string[] = cookie.split(';');
        const preparedCookies: Tcookie[] = [];
        cookiesRoot.forEach((cookie) => {
            preparedCookies.push({
                key: cookie.split('=')[0],
                value: cookie.substring(cookie.indexOf('=') + 1),
            });
        });
        return preparedCookies;
    };
}
