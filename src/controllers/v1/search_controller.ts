import { Response, Request } from 'express';
import play, { Spotify, SpotifyPlaylist, so_validate, sp_validate, yt_validate } from 'play-dl';
import SearchService from '../../services/search_service';
import ResolveService from '../../services/resolve_service';
import { musicEnum, providerEnum } from '../../utils/enums';
import { TrackInfo } from '../../utils/types';

export default class SearchController {
    private readonly _SearchService;
    private readonly _ResolveService;

    constructor() {
        this._SearchService = new SearchService();
        this._ResolveService = new ResolveService();
    }

    public search = async (req: Request, res: Response) => {
        const query = req.query.search_query;
        if (query === undefined) return res.status(400).json({ message: "Missing 'search_query' Parameter" });

        const decodedQuery = decodeURIComponent(query.toString());
        const queryInfo = await this._ResolveService.getProvider(decodedQuery);

        let result: TrackInfo | TrackInfo[] | false = false;

        switch (queryInfo.provider) {
            case providerEnum.Youtube:
                result = await this.handleYoutubeQuery(queryInfo.type, decodedQuery);
                break;
            case providerEnum.Spotify:
                result = await this._SearchService.querySpotify(decodedQuery);
                break;
            case providerEnum.Soundcloud:
                result = await this._SearchService.querySoundcloud(decodedQuery);
                break;
            default:
                res.status(500).json({ message: 'Unexpected track provider.' });
                break;
        }

        if (!result) {
            return res.status(500).json({ message: "Service wasn't able to extract track info" });
        }

        res.status(200).json(result);
    };

    private handleYoutubeQuery = async (type: musicEnum, query: string): Promise<TrackInfo | TrackInfo[] | false> => {
        switch (type) {
            case musicEnum.Playlist:
                return this._SearchService.queryYoutubePlaylist(query);
            case musicEnum.Video:
                return this._SearchService.queryYoutubeVideo(query);
            case musicEnum.Search:
                return this._SearchService.searchYoutubeVideo(query);
            default:
                return false;
        }
    };
}
