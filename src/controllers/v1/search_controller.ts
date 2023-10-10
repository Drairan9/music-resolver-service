import { Response, Request } from 'express';
import play, { Spotify, SpotifyPlaylist, so_validate, sp_validate, yt_validate } from 'play-dl';
import SearchService from '../../services/search_service';

export default class SearchController {
    private readonly _SearchService;

    constructor() {
        this._SearchService = new SearchService();
    }

    public search = async (req: Request, res: Response) => {
        const query = req.query.search_query;
        if (query === undefined) return res.status(400).json({ message: "Missing 'search_query' Parameter" });

        const decodedQuery = decodeURIComponent(query.toString());
        const provider = await this._SearchService.resolveProvider(decodedQuery);

        res.json(provider); // https://www.youtube.com/watch?v=r4U7zPb5-ZM&list=RDr4U7zPb5-ZM&start_radio=1
    };
}
