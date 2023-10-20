import play from 'play-dl';
import { YouTubeVideo as DummyYoutubeVideo } from './responses/YoutubeVideo';

const search = async (x: any, y: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        resolve([new DummyYoutubeVideo({})]);
    });
};

play.search = search;

module.exports = {
    ...jest.requireActual('play-dl'),
    search,
};
