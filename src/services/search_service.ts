import play, {
    yt_validate,
    sp_validate,
    so_validate,
    SpotifyTrack,
    SpotifyPlaylist,
    SoundCloudTrack,
    SoundCloudPlaylist,
    YouTubeVideo,
    YouTubePlayList,
} from 'play-dl';
import { musicEnum, providerEnum, trackSearchTypeEnum } from '../utils/enums';
import { TrackInfo } from '../utils/types';

export default class SearchService {
    public async resolveProvider(query: string): Promise<{ provider: providerEnum; type: musicEnum }> {
        // use validate from playdl
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

    public querySpotify = async (url: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
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
            console.log('querySpotify_service ' + error);
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

    public querySoundcloud = async (url: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
        try {
            let soundcloudResult = await play.soundcloud(url);
            if (soundcloudResult.type === musicEnum.User) return false;

            if (soundcloudResult.type === musicEnum.Track) {
                return this.mapSoundcloudTrack(soundcloudResult as SoundCloudTrack);
            }

            soundcloudResult = soundcloudResult as SoundCloudPlaylist;

            const tracks = await soundcloudResult.all_tracks();
            return tracks.map((track: SoundCloudTrack) => this.mapSoundcloudTrack(track));
        } catch (error) {
            console.log('querySoundcloud_service ' + error);
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

    // youtube

    public queryYoutubeVideo = async (url: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
        try {
            const youtubeResult = (await play.video_info(url)).video_details;
            if (youtubeResult.type === musicEnum.Channel) return false;

            return this.mapYoutubeVideo(youtubeResult);
        } catch (error) {
            console.log('queryYoutubeVideo_service ' + error);
            return false;
        }
    };

    public queryYoutubePlaylist = async (url: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
        try {
            const youtubeResult = await play.playlist_info(url, {
                incomplete: true,
            });
            const videos = await youtubeResult.all_videos();

            return videos.map((video: YouTubeVideo) => this.mapYoutubeVideo(video));
        } catch (error) {
            console.log('queryYoutubePlaylist_service ' + error);
            return false;
        }
    };

    public searchYoutubeVideo = async (query: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
        const youtubeResult = await play.search(query, {
            limit: 1,
        });
        return this.mapYoutubeVideo(youtubeResult[0]);
    };

    private mapYoutubeVideo = (video: YouTubeVideo): TrackInfo => {
        return {
            name: video.title === undefined ? 'YouTube Video' : video.title,
            url: video.url,
            thumbnail: video.thumbnails[0].url,
            search_type: trackSearchTypeEnum.Url,
        };
    };
}
