import play, {
    yt_validate,
    sp_validate,
    so_validate,
    SpotifyTrack,
    SpotifyPlaylist,
    SoundCloudTrack,
    SoundCloudPlaylist,
} from 'play-dl';
import { musicEnum, providerEnum, trackSearchTypeEnum } from '../utils/enums';
import { TrackInfo } from '../utils/types';

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

    // spotify

    public searchSpotify = async (url: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
        try {
            if (play.is_expired()) await play.refreshToken();

            let spotifyResult = await play.spotify(url);
            if (spotifyResult.type === musicEnum.Track) {
                return this.mapSpotifyTrack(spotifyResult as SpotifyTrack);
            }

            spotifyResult = spotifyResult as SpotifyPlaylist;

            const tracks = await spotifyResult.all_tracks();
            return tracks.map((track: SpotifyTrack) => this.mapSpotifyTrack(track));
        } catch (error) {
            console.log('searchSpotify_service' + error);
            return false;
        }
    };

    private mapSpotifyTrack = (audioTrack: SpotifyTrack): TrackInfo => {
        const artists = audioTrack.artists.map((artist) => artist.name);
        const thumbnail: string | undefined = audioTrack.thumbnail?.url;
        return {
            name: `${artists.join(', ')} - ${audioTrack.name}`,
            url: null,
            thumbnail: thumbnail === undefined ? null : thumbnail,
            search_type: trackSearchTypeEnum.Search,
        };
    };

    // soundcloud

    public searchSoundcloud = async (url: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
        try {
            if (play.is_expired()) await play.refreshToken();

            let soundcloudResult = await play.soundcloud(url);
            // In case of 'user' so_validate returns false. So whole resolver redirect it to the youtube search.
            if (soundcloudResult.type === musicEnum.Track) {
                return this.mapSoundcloudTrack(soundcloudResult as SoundCloudTrack);
            }

            soundcloudResult = soundcloudResult as SoundCloudPlaylist;

            const tracks = await soundcloudResult.all_tracks();
            return tracks.map((track: SoundCloudTrack) => this.mapSoundcloudTrack(track));
        } catch (error) {
            console.log('searchSoundcloud_service' + error);
            return false;
        }
    };

    private mapSoundcloudTrack = (audioTrack: SoundCloudTrack): TrackInfo => {
        return {
            name: audioTrack.name,
            url: audioTrack.url,
            thumbnail: audioTrack.thumbnail,
            search_type: trackSearchTypeEnum.Url,
        };
    };
}
