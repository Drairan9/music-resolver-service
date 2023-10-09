import express, { Request, Response, Router } from 'express';
import play from 'play-dl';

export default class ApiRouter {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.get('/search', async (req, res) => {
            const url = 'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U';

            const query_res = await play.spotify(url);
            console.log(query_res);

            res.status(200);
        });
    }
}
