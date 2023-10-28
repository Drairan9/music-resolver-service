import play from 'play-dl';

/**
 * Create Worker that gonna refresh auth cookies from YouTube
 */
export default class YoutubeCookieRotationWorker {
    // 10 minutes
    private readonly ROTATION_INETRVAL = 10 * 60000;

    constructor() {
        this.startWorker();
    }

    private startWorker = () => {
        setInterval(() => {
            play.video_info('https://www.youtube.com/watch?v=E_O8ygJZqxE');
        }, this.ROTATION_INETRVAL);
    };
}

//TODO: Check if cookie is expired on start
