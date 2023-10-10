import { yt_validate, sp_validate, so_validate } from 'play-dl';
import { musicEnum, providerEnum } from '../utils/enums';

export default class SearchService {
    public async resolveProvider(query: string): Promise<{ provider: providerEnum; type: musicEnum }> {
        const youtubeResult = yt_validate(query);
        if (youtubeResult) {
            if (query.startsWith('https') && youtubeResult === musicEnum.Video) {
                return { provider: providerEnum.Youtube, type: musicEnum.Video };
            }
            const mappedResultType: musicEnum = this.mapMusicTypeStringToEnum(youtubeResult);
            if (mappedResultType === musicEnum.Search) {
                return { provider: providerEnum.Youtube, type: musicEnum.Search };
            }

            return { provider: providerEnum.Youtube, type: mappedResultType };
        }

        const spotifyResult = sp_validate(query);
        if (spotifyResult) {
            if (spotifyResult === musicEnum.Search) {
                return { provider: providerEnum.Youtube, type: musicEnum.Search };
            }
            const mappedResultType: musicEnum = this.mapMusicTypeStringToEnum(spotifyResult);
            if (mappedResultType === musicEnum.Search) {
                return { provider: providerEnum.Youtube, type: musicEnum.Search };
            }
            return { provider: providerEnum.Spotify, type: mappedResultType };
        }

        const soundcloudResult = await so_validate(query);
        if (soundcloudResult) {
            if (soundcloudResult === musicEnum.Search) {
                return { provider: providerEnum.Youtube, type: musicEnum.Search };
            }
            const mappedResultType: musicEnum = this.mapMusicTypeStringToEnum(soundcloudResult);
            if (mappedResultType === musicEnum.Search) {
                return { provider: providerEnum.Youtube, type: musicEnum.Search };
            }
            return { provider: providerEnum.Soundcloud, type: mappedResultType };
        }

        return { provider: providerEnum.Youtube, type: musicEnum.Search };
    }

    private mapMusicTypeStringToEnum(provider: string): musicEnum {
        switch (provider) {
            case 'playlist':
                return musicEnum.Playlist;
            case 'video':
                return musicEnum.Video;
            case 'search':
                return musicEnum.Search;
            case 'track':
                return musicEnum.Track;
            case 'album':
                return musicEnum.Album;
            default:
                return musicEnum.Search;
        }
    }
}
