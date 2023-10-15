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
    InfoData,
    SoundCloud,
    Spotify,
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

            let spotifyResult: Spotify = await play.spotify(url);
            if (spotifyResult.type === musicEnum.Track) {
                return this.mapSpotifyTrack(spotifyResult as SpotifyTrack);
            }

            const spotifyPlaylist: SpotifyPlaylist = spotifyResult as SpotifyPlaylist;

            const tracks: SpotifyTrack[] = await spotifyPlaylist.all_tracks();
            return tracks.map((track: SpotifyTrack) => this.mapSpotifyTrack(track));
        } catch (error) {
            console.log('querySpotify_service ' + error);
            return false;
        }
    };

    private mapSpotifyTrack = (audioTrack: SpotifyTrack): TrackInfo => {
        const artists: string[] = audioTrack.artists.map((artist) => artist.name);
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
            let soundcloudResult: SoundCloud = await play.soundcloud(url);
            if (soundcloudResult.type === musicEnum.User) return false;

            if (soundcloudResult.type === musicEnum.Track) {
                return this.mapSoundcloudTrack(soundcloudResult as SoundCloudTrack);
            }

            const soundcloudPlaylist: SoundCloudPlaylist = soundcloudResult as SoundCloudPlaylist;

            const tracks: SoundCloudTrack[] = await soundcloudPlaylist.all_tracks();
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
            const youtubeResult: YouTubeVideo = (await play.video_info(url)).video_details;
            if (youtubeResult.type === musicEnum.Channel) return false;

            return this.mapYoutubeVideo(youtubeResult);
        } catch (error) {
            console.log('queryYoutubeVideo_service ' + error);
            return false;
        }
    };

    public queryYoutubePlaylist = async (url: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
        try {
            const youtubeResult: YouTubePlayList = await play.playlist_info(url, {
                incomplete: true,
            });
            const videos: YouTubeVideo[] = await youtubeResult.all_videos();

            return videos.map((video: YouTubeVideo) => this.mapYoutubeVideo(video));
        } catch (error) {
            // Youtube autogenerated playlists cant be shared rn
            // So in case of empty initial data, generate random playlist (It can take some time)
            const watchMixErrorMessage: string = 'Watch playlist unavailable due to YouTube layout changes.';
            if (error instanceof Error && error.message === watchMixErrorMessage) {
                return this.genYoutubeRandomPlaylist(url);
            }
            console.log('queryYoutubePlaylist_service ' + error);
            return false;
        }
    };

    private genYoutubeRandomPlaylist = async (url: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
        try {
            const rootVideo: InfoData = await play.video_info(url);

            const promises = rootVideo.related_videos.map((url) => play.video_info(url));
            const responses = await Promise.all(promises);

            return responses.map((res) => this.mapYoutubeVideo(res.video_details));
        } catch (error) {
            console.log('genYoutubeRandomPlaylist_service ' + error);
            return false;
        }
    };

    public searchYoutubeVideo = async (query: string): Promise<TrackInfo | Array<TrackInfo> | false> => {
        const youtubeResult: YouTubeVideo[] = await play.search(query, {
            limit: 1,
        });
        return this.mapYoutubeVideo(youtubeResult[0]);
    };

    private mapYoutubeVideo = (video: YouTubeVideo): TrackInfo => {
        const thumbnail: string | null = video.thumbnails[0] ? video.thumbnails[0].url : null;
        return {
            name: video.title === undefined ? 'YouTube Video' : video.title,
            url: video.url,
            thumbnail: thumbnail,
            search_type: trackSearchTypeEnum.Url,
        };
    };
}
