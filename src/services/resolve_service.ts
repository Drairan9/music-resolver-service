import { so_validate, yt_validate, sp_validate } from 'play-dl';
import { musicEnum, providerEnum } from '../utils/enums';

export default class ResolveService {
    public async getProvider(query: string): Promise<{ provider: providerEnum; type: musicEnum }> {
        const cleanQuery = query.trim();

        const youtube = this.isYouTubeQuery(cleanQuery);
        if (youtube) return { provider: providerEnum.Youtube, type: youtube };

        const spotify = this.isSpotifyQuery(cleanQuery);
        if (spotify) {
            if (spotify === musicEnum.Search) {
                return { provider: providerEnum.Youtube, type: musicEnum.Search };
            }

            return { provider: providerEnum.Spotify, type: spotify };
        }

        const soundcloud = await this.isSoundcloudQuery(cleanQuery);
        if (soundcloud) {
            if (soundcloud === musicEnum.Search) {
                return { provider: providerEnum.Youtube, type: musicEnum.Search };
            }

            return { provider: providerEnum.Soundcloud, type: soundcloud };
        }

        return { provider: providerEnum.Youtube, type: musicEnum.Search };
    }

    private isYouTubeQuery(url: string): false | musicEnum {
        const youtubeResult = yt_validate(url);
        if (!youtubeResult) return false;

        if (url.startsWith('https') && youtubeResult === musicEnum.Video) {
            return musicEnum.Video;
        }

        return this.mapMusicTypeStringToEnum(youtubeResult);
    }

    private isSpotifyQuery(url: string): false | musicEnum {
        const spotifyResult = sp_validate(url);
        if (!spotifyResult) return false;
        return this.mapMusicTypeStringToEnum(spotifyResult);
    }

    private async isSoundcloudQuery(url: string) {
        const soundcloudResult = await so_validate(url);
        if (!soundcloudResult) return false;
        return this.mapMusicTypeStringToEnum(soundcloudResult);
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
