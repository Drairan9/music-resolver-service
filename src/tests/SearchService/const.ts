import { SpotifyTrack, YouTubeChannel, YouTubeVideo } from 'play-dl';
import { DummyYouTubeChannel } from '../classes/dummy_youtube_channel';
import { DummyYouTubeVideo } from '../classes/dummy_youtube_video';
import { DummyYouTubeThumbnail } from '../classes/dummy_youtube_thumbnail';

const dummyYoutubeChannel: YouTubeChannel = new DummyYouTubeChannel({
    type: 'channel',
    name: 'Brain Dead Familia',
    verified: true,
    artist: false,
    id: 'UCKVO2wm5N_ayOaTxDXzX4-w',
    url: 'https://www.youtube.com/channel/UCKVO2wm5N_ayOaTxDXzX4-w',
    icons: [],
    subscribers: undefined,
});

const thumbnail = new DummyYouTubeThumbnail({
    url: 'https://i.ytimg.com/vi/k6h0P541YlY/hqdefault.jpg?sqp=-oaymwEbCMQBEG5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDQE00u7nxxbHRTpaPtiBCdH8xtmw',
    width: 196,
    height: 110,
});

export const dummyYoutubeVideo: YouTubeVideo = new DummyYouTubeVideo({
    id: 'k6h0P541YlY',
    url: 'https://www.youtube.com/watch?v=k6h0P541YlY',
    type: 'video',
    title: 'Paluch x Słoń - Zima (prod. Chris Carson)',
    description: 'Desc',
    durationRaw: '03:22',
    durationInSec: 202,
    uploadedAt: '2023-03-20T07:00:01-07:00',
    liveAt: undefined,
    upcoming: undefined,
    views: 927683,
    thumbnails: [thumbnail, thumbnail],
    channel: dummyYoutubeChannel,
    likes: 21105,
    live: false,
    private: false,
    tags: [
        'słoń',
        'paluch',
        'pośród hien',
        'zima',
        'cris carson',
        'bor',
        'bdf',
        'braindead familia',
        'biuro ochrony rapu',
    ],
    discretionAdvised: false,
    music: [
        {
            song: 'Zima ',
            url: null,
            artist: 'Paluch x Słoń',
            album: 'Pośród Hien',
            licenses: 'steprecordspl (on behalf of BOR / BDF), and 4 Music Rights Societies',
        },
    ],
    chapters: [],
});
