import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { request as requestHttps } from 'node:https';
import { RequestOptions, IncomingMessage } from 'node:http';
import play from 'play-dl';
type TcookieFile = {
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
    // 9 minutes
    private readonly ROTATION_INETRVAL = 9 * 60000;
    private privateCookie: string = '';

    constructor() {
        if (!existsSync('.data/youtube.data')) {
            throw new Error('Please generate YouTube cookies file using auth.js');
        }
        this.privateCookie = this.stringifyCookie(JSON.parse(readFileSync('.data/youtube.data', 'utf-8')).cookie);
        this.startWorker();
    }

    private startWorker = async () => {
        const firstQuery = await this.rotateCookies();
        if (!firstQuery) {
            throw new Error(
                'Youtube did not respond with fresh cookies. Please generate new YouTube cookies file manually using auth.js'
            );
        }

        setInterval(() => {
            this.rotateCookies();
        }, this.ROTATION_INETRVAL);
    };

    private rotateCookies = async (): Promise<boolean> => {
        const newCookies = await this.requestCookieRotation();
        if (!newCookies) return false;

        newCookies.forEach((cookie: Tcookie) => {
            this.setCookie(cookie);
        });
        this.uploadCookie();
        const viinf = await play.video_info(
            'https://www.youtube.com/watch?v=3jZGUPM2NFI&t=44s&ab_channel=SamochodzikHenio'
        );
        console.log(viinf.video_details.title);
        return true;
    };

    private requestCookieRotation = async (): Promise<Tcookie[] | false> => {
        this.privateCookie = this.stringifyCookie(JSON.parse(readFileSync('.data/youtube.data', 'utf-8')).cookie);
        const request: IncomingMessage = await new Promise((resolve) => {
            const req_options: RequestOptions = {
                host: 'accounts.youtube.com',
                path: '/RotateCookies',
                headers: {
                    accept: '*/*',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-type': 'application/json',
                    'sec-ch-ua': '"Chromium";v="118", "Microsoft Edge";v="118", "Not=A?Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'same-origin',
                    'sec-fetch-site': 'same-origin',
                    'sec-gpc': '1',
                    cookie: this.privateCookie,
                    Referer: 'https://accounts.youtube.com/RotateCookiesPage?origin=https://www.youtube.com&yt_pid=1',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                },
                method: 'POST',
            };
            const post_data = '[null,"-8202410111774881648",1]';
            const req = requestHttps(req_options, resolve);
            req.write(post_data);
            req.end();
        });

        console.table({
            ID: 'COOKIE ROTATION DEBUG',
            STATUS: `${request.statusCode} - ${request.statusMessage}`,
            TIMESTAMP: new Date().toLocaleString(),
        });

        if (request.statusCode !== 200) return false;

        const newCookies: string[] | undefined = request.headers['set-cookie'];
        if (newCookies === undefined || newCookies.length < 1) return false;

        return newCookies.map((cookie) => this.extractCookieFromString(cookie));
    };

    private extractCookieFromString = (cookieString: string): Tcookie => {
        const cookieRoot: string = cookieString.split(';')[0];
        return {
            key: cookieRoot.split('=')[0],
            value: cookieRoot.substring(cookieRoot.indexOf('=') + 1),
        };
    };

    private setCookie = (cookie: Tcookie): void => {
        const object = this.objectifyCookie(this.privateCookie);
        Object.assign(object, {
            [cookie.key]: cookie.value,
        });
        this.privateCookie = this.stringifyCookie(object);
    };

    private uploadCookie = () => {
        const cookieFile: TcookieFile = {
            file: true,
            cookie: this.objectifyCookie(this.privateCookie),
        };
        writeFileSync('.data/youtube.data', JSON.stringify(cookieFile, undefined, 4));
    };

    private stringifyCookie = (cookieJson: object): string => {
        let cookieString = '';
        for (const [key, value] of Object.entries(cookieJson)) {
            cookieString += `${key}=${value}; `;
        }
        return cookieString;
    };

    private objectifyCookie = (cookieString: string): object => {
        const splittedCookies: string[] = cookieString.split(';');
        const cookieObject = {};

        splittedCookies.forEach((cookie) => {
            const key = cookie.split('=')[0].trim();
            const value = cookie.substring(cookie.indexOf('=') + 1).trim();
            Object.assign(cookieObject, { [key]: value });
        });
        return cookieObject;
    };
}
