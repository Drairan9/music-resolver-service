import { trackSearchTypeEnum } from './enums';

export type TrackInfo = {
    name: string;
    url: string | null;
    thumbnail: string | null;
    search_type: trackSearchTypeEnum;
};
