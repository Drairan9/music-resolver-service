import express, { Request, Response, Router } from 'express';
import SearchController from '../../controllers/v1/search_controller';

export default class ApiRouter {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.get('/search', new SearchController().search);
    }
}
