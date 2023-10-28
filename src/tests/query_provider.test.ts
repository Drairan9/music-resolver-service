import SearchService from '../services/search_service';
import { TrackInfo } from '../utils/types';

const _SearchService = new SearchService();

describe('Querying providers **ONLINE TEST**', () => {
    describe('Query Spotify', () => {
        test('Spotify track', async () => {
            expect(
                await _SearchService.querySpotify(
                    'https://open.spotify.com/track/2e9EZ2V5QGGZPMJacO3y0Y?si=b4b1d33bb4ef4b37'
                )
            ).toStrictEqual([
                {
                    name: 'Waka Flocka Flame, Kebo Gotti - Grove St. Party (feat. Kebo Gotti)',
                    search_type: 'search',
                    thumbnail: 'https://i.scdn.co/image/fade577145599daff924bb7b28386a84f67bd1db',
                    url: null,
                },
            ]);
        });

        test('Spotify playlist', async () => {
            expect(
                await _SearchService.querySpotify(
                    'https://open.spotify.com/playlist/74DRnTTbve5hvRKLNVQ0EH?si=e15435bf8a584f72'
                )
            ).toStrictEqual([
                {
                    name: 'Metro Boomin, Offset, Drake - No Complaints (feat. Offset & Drake) (Bonus)',
                    search_type: 'search',
                    thumbnail: 'https://i.scdn.co/image/ab67616d0000b2732887f8c05b5a9f1cb105be29',
                    url: null,
                },
                {
                    name: 'Drake, 21 Savage - Broke Boys',
                    search_type: 'search',
                    thumbnail: 'https://i.scdn.co/image/ab67616d0000b27302854a7060fccc1a66a4b5ad',
                    url: null,
                },
            ]);
        });

        test('Spotify album', async () => {
            expect(
                await _SearchService.querySpotify(
                    'https://open.spotify.com/album/6ySR1wBVAMPQiKIAKwZi0X?si=1sKxOKE7SDOt1k6b-3LpEg'
                )
            ).toStrictEqual([
                { name: 'Lil Revive - Grim Peaks', search_type: 'search', thumbnail: null, url: null },
                { name: "Lil Revive - I Don't Feel So Good", search_type: 'search', thumbnail: null, url: null },
                {
                    name: "Lil Revive - Even Though I Live, I Don't Feel Alive",
                    search_type: 'search',
                    thumbnail: null,
                    url: null,
                },
                { name: "Lil Revive - Tell the Reaper I'm Sorry", search_type: 'search', thumbnail: null, url: null },
                { name: 'Lil Revive - I Never Asked 2 Exist', search_type: 'search', thumbnail: null, url: null },
                {
                    name: "Lil Revive - The Most Important Things Aren't Things",
                    search_type: 'search',
                    thumbnail: null,
                    url: null,
                },
                { name: 'Lil Revive, Darko - Hurts 2 Exist', search_type: 'search', thumbnail: null, url: null },
            ]);
        });
    });

    describe('Query Soundcloud', () => {
        test('Soundcloud track', async () => {
            expect(await _SearchService.querySoundcloud('https://soundcloud.com/hexibase/oho')).toStrictEqual([
                {
                    name: 'OhO',
                    search_type: 'url',
                    thumbnail: 'https://i1.sndcdn.com/artworks-NFAdcQtRWD3h1Ad8-YPCUUw-large.png',
                    url: 'https://api.soundcloud.com/tracks/929913478',
                },
            ]);
        });

        test('Soundcloud playlist', async () => {
            expect(
                await _SearchService.querySoundcloud('https://soundcloud.com/user-802956580/sets/hexabase')
            ).toStrictEqual([
                {
                    name: 'OhO',
                    search_type: 'url',
                    thumbnail: 'https://i1.sndcdn.com/artworks-NFAdcQtRWD3h1Ad8-YPCUUw-large.png',
                    url: 'https://api.soundcloud.com/tracks/929913478',
                },
            ]);
        });
    });

    describe('Query Youtube', () => {
        test('Youtube video', async () => {
            expect(await _SearchService.queryYoutubeVideo('https://www.youtube.com/watch?v=E_O8ygJZqxE')).toStrictEqual(
                [
                    {
                        name: 'Spinning dorito',
                        search_type: 'url',
                        thumbnail: expect.any(String),
                        url: 'https://www.youtube.com/watch?v=E_O8ygJZqxE',
                    },
                ]
            );
        });

        test('Youtube playlist', async () => {
            expect(
                await _SearchService.queryYoutubePlaylist(
                    'https://www.youtube.com/watch?v=poa_QBvtIBA&list=PL03xBfsbcmWKru9SW1q4nNjSGQ8jvdRDF'
                )
            ).toStrictEqual([
                {
                    name: 'funky town low quality',
                    search_type: 'url',
                    thumbnail: expect.any(String),
                    url: 'https://www.youtube.com/watch?v=poa_QBvtIBA',
                },
                {
                    name: 'Hey Ya! Low quality',
                    search_type: 'url',
                    thumbnail: expect.any(String),
                    url: 'https://www.youtube.com/watch?v=LMaG_uOa440',
                },
                {
                    name: 'spinning fish meme with greenday brain stew music full (low quality sound)',
                    search_type: 'url',
                    thumbnail: expect.any(String),
                    url: 'https://www.youtube.com/watch?v=xtPbyVFWUeI',
                },
                {
                    name: 'Bad quality fish spinning to you spin me right round',
                    search_type: 'url',
                    thumbnail: expect.any(String),
                    url: 'https://www.youtube.com/watch?v=coijX_WkKPw',
                },
                {
                    name: 'fish spinning to low quality octavarium by dream theater',
                    search_type: 'url',
                    thumbnail: expect.any(String),
                    url: 'https://www.youtube.com/watch?v=n6Thyd1IrXI',
                },
                {
                    name: 'Tobi King - Loli Mou low quality spinning fish',
                    search_type: 'url',
                    thumbnail: expect.any(String),
                    url: 'https://www.youtube.com/watch?v=ILvI_3lB_RY',
                },
                {
                    name: 'im still standing low quality with fish spinning',
                    search_type: 'url',
                    thumbnail: expect.any(String),
                    url: 'https://www.youtube.com/watch?v=lPDHwIj_RMU',
                },
                {
                    name: 'scatman song (low quality)',
                    search_type: 'url',
                    thumbnail: expect.any(String),
                    url: 'https://www.youtube.com/watch?v=NlEvCNYHNgU',
                },
            ]);
        });

        test('Youtube Search', async () => {
            expect(await _SearchService.searchYoutubeVideo('Test query')).toStrictEqual([
                {
                    name: expect.any(String),
                    search_type: 'url',
                    thumbnail: expect.any(String),
                    url: expect.any(String),
                },
            ]);
        });

        test('Youtube MIX playlist', async () => {
            expect(
                await _SearchService.queryYoutubePlaylist(
                    'https://www.youtube.com/watch?v=nGZlDTtwp5w&list=RDnGZlDTtwp5w&start_radio=1'
                )
            ).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: expect.any(String),
                        search_type: 'url',
                        thumbnail: expect.any(String),
                        url: expect.any(String),
                    }),
                ])
            );
        }, 20000);
    });
});
