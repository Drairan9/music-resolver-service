import { YouTubeChannel } from './YoutubeChannel';

interface VideoMusic {
    song?: string;
    url?: string | null;
    artist?: string;
    album?: string;
    writers?: string;
    licenses?: string;
}

interface VideoOptions {
    id?: string;
    url: string;
    title?: string;
    description?: string;
    durationRaw: string;
    durationInSec: number;
    uploadedAt?: string;
    upcoming?: Date | true;
    views: number;
    thumbnail?: {
        width: number | undefined;
        height: number | undefined;
        url: string | undefined;
    };
    channel?: YouTubeChannel;
    likes: number;
    live: boolean;
    private: boolean;
    tags: string[];
    discretionAdvised?: boolean;
    music?: VideoMusic[];
    chapters: VideoChapter[];
}

export interface VideoChapter {
    title: string;
    timestamp: string;
    seconds: number;
    thumbnails: YouTubeThumbnail[];
}

export class YouTubeVideo {
    id?: string;
    url: string;
    type: 'video' | 'playlist' | 'channel';
    title?: string;
    description?: string;
    durationRaw: string;
    durationInSec: number;
    uploadedAt?: string;
    liveAt?: string;
    upcoming?: Date | true;
    views: number;
    thumbnails: YouTubeThumbnail[];
    channel?: YouTubeChannel;
    likes: number;
    live: boolean;
    private: boolean;
    tags: string[];
    discretionAdvised?: boolean;
    music?: VideoMusic[];
    chapters: VideoChapter[];

    constructor(data: any) {
        if (!data) throw new Error(`Can not initiate ${this.constructor.name} without data`);

        this.id = 'xxx';
        this.url = `https://www.youtube.com/watch?v=xxx`;
        this.type = 'video';
        this.title = 'xxx';
        this.description = 'xxx';
        this.durationRaw = '0:00';
        this.durationInSec = 0;
        this.uploadedAt = '2023-03-20T07:00:01-07:00';
        this.liveAt = undefined;
        this.upcoming = undefined;
        this.views = 0;
        this.thumbnails = [new YouTubeThumbnail({}), new YouTubeThumbnail({})];
        this.channel = new YouTubeChannel({});
        this.likes = 0;
        this.live = false;
        this.private = false;
        this.tags = [];
        this.discretionAdvised = false;
        this.music = [
            {
                song: 'X ',
                url: null,
                artist: 'x X x',
                album: 'xxx',
                licenses: 'xxx',
            },
        ];
        this.chapters = [];
    }

    toString(): string {
        return this.url || '';
    }

    toJSON(): VideoOptions {
        return {
            id: this.id,
            url: this.url,
            title: this.title,
            description: this.description,
            durationInSec: this.durationInSec,
            durationRaw: this.durationRaw,
            uploadedAt: this.uploadedAt,
            thumbnail: this.thumbnails[this.thumbnails.length - 1].toJSON() || this.thumbnails,
            channel: this.channel,
            views: this.views,
            tags: this.tags,
            likes: this.likes,
            live: this.live,
            private: this.private,
            discretionAdvised: this.discretionAdvised,
            music: this.music,
            chapters: this.chapters,
        };
    }
}

class YouTubeThumbnail {
    url: string;
    width: number;
    height: number;

    constructor(data: any) {
        this.url = 'xxx';
        this.width = 2;
        this.height = 2;
    }

    toJSON() {
        return {
            url: this.url,
            width: this.width,
            height: this.height,
        };
    }
}
