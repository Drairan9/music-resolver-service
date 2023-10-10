import { Response, Request } from 'express';
import play, { Spotify, SpotifyPlaylist, so_validate, sp_validate, yt_validate } from 'play-dl';
import SearchService from '../../services/search_service';
import { providerEnum } from '../../utils/enums';
import { TrackInfo } from '../../utils/types';

export default class SearchController {
    private readonly _SearchService;

    constructor() {
        this._SearchService = new SearchService();
    }

    public search = async (req: Request, res: Response) => {
        const query = req.query.search_query;
        if (query === undefined) return res.status(400).json({ message: "Missing 'search_query' Parameter" });

        const decodedQuery = decodeURIComponent(query.toString());
        const queryInfo = await this._SearchService.resolveProvider(decodedQuery);

        let result: TrackInfo | TrackInfo[] | false = false;
        switch (queryInfo.provider) {
            case providerEnum.Youtube:
                console.log('look at that');
                break;
            case providerEnum.Spotify:
                result = await this._SearchService.searchSpotify(decodedQuery);
                console.log('look at that');
                break;
            case providerEnum.Soundcloud:
                result = await this._SearchService.searchSoundcloud(decodedQuery);
                console.log('look at that');
                break;
            default:
                res.status(500).json({ message: 'Unexpected track provider.' });
                break;
        }

        if (!result) {
            return res.status(500).json({ message: "Service wasn't able to extract track info" });
        }

        res.json(result); // https://www.youtube.com/watch?v=r4U7zPb5-ZM&list=RDr4U7zPb5-ZM&start_radio=1
    };
}
