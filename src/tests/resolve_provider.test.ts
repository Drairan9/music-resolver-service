import SearchService from '../services/search_service';
import { musicEnum, providerEnum } from '../utils/enums';

const _SearchService = new SearchService();

describe('Resolving providers', () => {
    describe('Youtube provider', () => {
        const tests = [
            {
                name: 'Youtube video',
                query: 'https://www.youtube.com/watch?v=E_O8ygJZqxE',
                provider: providerEnum.Youtube,
                type: musicEnum.Video,
            },
            {
                name: 'Youtube playlist',
                query: 'https://www.youtube.com/watch?v=poa_QBvtIBA&list=PL03xBfsbcmWKru9SW1q4nNjSGQ8jvdRDF',
                provider: providerEnum.Youtube,
                type: musicEnum.Playlist,
            },
            {
                name: 'Youtube mix',
                query: 'https://www.youtube.com/watch?v=nGZlDTtwp5w&list=RDnGZlDTtwp5w&start_radio=1',
                provider: providerEnum.Youtube,
                type: musicEnum.Playlist,
            },
            {
                name: 'Youtube channel',
                query: 'https://www.youtube.com/@DGainz',
                provider: providerEnum.Youtube,
                type: musicEnum.Search,
            },
            {
                name: 'Youtube search',
                query: 'Test song query',
                provider: providerEnum.Youtube,
                type: musicEnum.Search,
            },
        ];

        for (let i = 0; i < tests.length; i++) {
            test(tests[i].name, async () => {
                expect(await _SearchService.resolveProvider(tests[i].query)).toStrictEqual({
                    provider: tests[i].provider,
                    type: tests[i].type,
                });
            });
        }
    });

    describe('Spotify provider', () => {
        const tests = [
            {
                name: 'Spotify track',
                query: 'https://open.spotify.com/track/2e9EZ2V5QGGZPMJacO3y0Y?si=b4b1d33bb4ef4b37',
                provider: providerEnum.Spotify,
                type: musicEnum.Track,
            },
            {
                name: 'Spotify playlist',
                query: 'https://open.spotify.com/playlist/37i9dQZF1EIXZX3iPZenSk',
                provider: providerEnum.Spotify,
                type: musicEnum.Playlist,
            },
            {
                name: 'Spotify album',
                query: 'https://open.spotify.com/album/0tUUX9X5xhonVyCPXmHLDf',
                provider: providerEnum.Spotify,
                type: musicEnum.Album,
            },
            {
                name: 'Spotify user',
                query: 'https://open.spotify.com/artist/1VPmR4DJC1PlOtd0IADAO0',
                provider: providerEnum.Youtube,
                type: musicEnum.Search,
            },
        ];

        for (let i = 0; i < tests.length; i++) {
            test(tests[i].name, async () => {
                expect(await _SearchService.resolveProvider(tests[i].query)).toStrictEqual({
                    provider: tests[i].provider,
                    type: tests[i].type,
                });
            });
        }
    });

    describe('Soundcloud provider', () => {
        const tests = [
            {
                name: 'Soundcloud track',
                query: 'https://soundcloud.com/hexibase/oho',
                provider: providerEnum.Soundcloud,
                type: musicEnum.Track,
            },
            {
                name: 'Soundcloud playlist',
                query: 'https://soundcloud.com/user-802956580/sets/hexabase',
                provider: providerEnum.Soundcloud,
                type: musicEnum.Playlist,
            },
            {
                name: 'Soundcloud user',
                query: 'https://soundcloud.com/hexibase',
                provider: providerEnum.Youtube,
                type: musicEnum.Search,
            },
        ];

        for (let i = 0; i < tests.length; i++) {
            test(tests[i].name, async () => {
                expect(await _SearchService.resolveProvider(tests[i].query)).toStrictEqual({
                    provider: tests[i].provider,
                    type: tests[i].type,
                });
            });
        }
    });
});
