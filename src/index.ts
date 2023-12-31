import express from 'express';
import routes from './routes/index';
import YoutubeCookieRotationWorker from './workers/youtubeCookieRotation';

class WebServer {
    private app: express.Application;
    private readonly port: number = 3333;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        this.app.use(express.json());
        this.app.use('/api/v1', new routes.v1.ApiRouter().router);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log('Service started.');
            console.log(`Listening on port ${this.port}`);
        });
        new YoutubeCookieRotationWorker();
    }
}

const server = new WebServer();
server.start();
