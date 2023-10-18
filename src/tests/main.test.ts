import play, { YouTubeVideo } from 'play-dl';
jest.mock('play-dl');
import SearchService from '../services/search_service';
import { dummyYoutubeVideo } from './SearchService/const';

test('test youtube search', async () => {
    jest.spyOn(play, 'search').mockResolvedValue([dummyYoutubeVideo]);

    const _SearchService = new SearchService();

    expect(await _SearchService.searchYoutubeVideo('https://www.youtube.com/watch?v=WX_oe9hPuXk')).toMatchObject({
        name: expect.any(String),
        search_type: expect.any(String),
        thumbnail: expect.any(String),
        url: expect.any(String),
    });
});
