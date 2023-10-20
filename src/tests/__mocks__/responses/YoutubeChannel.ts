export interface ChannelIconInterface {
    url: string;
    width: number;
    height: number;
}

export class YouTubeChannel {
    name?: string;
    verified?: boolean;
    artist?: boolean;
    id?: string;
    type: 'video' | 'playlist' | 'channel';
    url?: string;
    icons?: ChannelIconInterface[];
    subscribers?: string;

    constructor(data: any = {}) {
        if (!data) throw new Error(`Cannot instantiate the ${this.constructor.name} class without data!`);
        this.type = 'channel';
        this.name = 'xxx';
        this.verified = true;
        this.artist = false;
        this.id = 'xxx';
        this.url = 'xxx';
        this.icons = [{ url: 'xxx', width: 0, height: 0 }];
        this.subscribers = undefined;
    }

    iconURL(options = { size: 0 }): string | undefined {
        if (typeof options.size !== 'number' || options.size < 0) throw new Error('invalid icon size');
        if (!this.icons?.[0]?.url) return undefined;
        const def = this.icons?.[0]?.url.split('=s')[1].split('-c')[0];
        return this.icons?.[0]?.url.replace(`=s${def}-c`, `=s${options.size}-c`);
    }

    toString(): string {
        return this.name || '';
    }

    toJSON(): ChannelJSON {
        return {
            name: this.name,
            verified: this.verified,
            artist: this.artist,
            id: this.id,
            url: this.url,
            icons: this.icons,
            type: this.type,
            subscribers: this.subscribers,
        };
    }
}

interface ChannelJSON {
    name?: string;
    verified?: boolean;
    artist?: boolean;
    id?: string;
    type: 'video' | 'playlist' | 'channel';
    url?: string;
    icons?: ChannelIconInterface[];
    subscribers?: string;
}
