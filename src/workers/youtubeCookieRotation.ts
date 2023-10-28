import play from 'play-dl';
import { request as requestHttps } from 'node:https';
import { RequestOptions, IncomingMessage } from 'node:http';
import { existsSync, readFileSync } from 'fs';

type TyoutubeDataOptions = {
    cookie?: Object;
    file?: boolean;
};

/**
 * Create Worker that gonna refresh auth cookies from YouTube
 */
export default class YoutubeCookieRotationWorker {
    // 10 minutes
    private readonly ROTATION_INETRVAL = 10 * 60000;
    private youtubeData: TyoutubeDataOptions = { file: false };
    private cookieString: string = '';

    constructor() {
        if (!existsSync('.data/youtube.data')) {
            throw new Error('Please generate YouTube cookies file using auth.js');
        }
        this.youtubeData = JSON.parse(readFileSync('.data/youtube.data', 'utf-8'));
        this.youtubeData.file = true;

        this.startWorker();
    }

    private startWorker = async () => {
        await this.isYoutubeSessionValid();
        setInterval(() => {
            play.video_info('https://www.youtube.com/watch?v=E_O8ygJZqxE');
        }, this.ROTATION_INETRVAL);
    };

    private isYoutubeSessionValid = async (): Promise<true> => {
        const request: IncomingMessage = await new Promise((resolve) => {
            const req_options: RequestOptions = {
                host: 'accounts.youtube.com',
                path: '/RotateCookies',
                headers: {
                    'content-type': 'application/json',
                    cookie: this.stringifyCookie(),
                },
                method: 'POST',
            };
            const post_data = '[null,"-8202410111774881648",1]';
            const req = requestHttps(req_options, resolve);
            req.write(post_data);
            req.end();
        });

        if (request.statusCode !== 200) {
            switch (request.statusCode) {
                case 401:
                    throw new Error(
                        `Your cookie is invalid or expired. Please import an new cookies manually. ${request.statusCode} - ${request.statusMessage}`
                    );
                case 429:
                    throw new Error(
                        `Too Many Requests, please try again after a minute. ${request.statusCode} - ${request.statusMessage}`
                    );
                default:
                    throw new Error(
                        `An error occurred during cookie validation. ${request.statusCode} - ${request.statusMessage}`
                    );
            }
        }

        const freshCookies: string[] | undefined = request.headers['set-cookie'];
        if (freshCookies === undefined || freshCookies.length < 1) {
            throw new Error('Youtube did not respond with new cookies. Please import new cookies manually.');
        }

        return true;
    };

    private stringifyCookie = (): string | undefined => {
        let result = '';
        if (!this.youtubeData?.cookie) return undefined;
        for (const [key, value] of Object.entries(this.youtubeData.cookie)) {
            result += `${key}=${value};`;
        }
        return result;
    };
}
