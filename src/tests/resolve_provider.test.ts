import SearchService from '../services/search_service';
import { musicEnum, providerEnum } from '../utils/enums';

const _SearchService = new SearchService();

describe('Resolving providers', () => {
    describe('Youtube provider', () => {
        test('Youtube video', async () => {
            expect(await _SearchService.resolveProvider('https://www.youtube.com/watch?v=E_O8ygJZqxE')).toStrictEqual({
                provider: providerEnum.Youtube,
                type: musicEnum.Video,
            });
        });

        test('Youtube playlist', async () => {
            expect(
                await _SearchService.resolveProvider(
                    'https://www.youtube.com/watch?v=poa_QBvtIBA&list=PL03xBfsbcmWKru9SW1q4nNjSGQ8jvdRDF'
                )
            ).toStrictEqual({
                provider: providerEnum.Youtube,
                type: musicEnum.Playlist,
            });
        });

        test('Youtube mix', async () => {
            expect(
                await _SearchService.resolveProvider(
                    'https://www.youtube.com/watch?v=nGZlDTtwp5w&list=RDnGZlDTtwp5w&start_radio=1'
                )
            ).toStrictEqual({
                provider: providerEnum.Youtube,
                type: musicEnum.Playlist,
            });
        });

        test('Youtube channel', async () => {
            expect(await _SearchService.resolveProvider('https://www.youtube.com/@DGainz')).toStrictEqual({
                provider: providerEnum.Youtube,
                type: musicEnum.Search,
            });
        });

        test('Youtube search', async () => {
            expect(await _SearchService.resolveProvider('Test song query')).toStrictEqual({
                provider: providerEnum.Youtube,
                type: musicEnum.Search,
            });
        });
    });

    describe('Spotify provider', () => {
        test('Spotify track', async () => {
            expect(
                await _SearchService.resolveProvider(
                    'https://open.spotify.com/track/2e9EZ2V5QGGZPMJacO3y0Y?si=b4b1d33bb4ef4b37'
                )
            ).toStrictEqual({
                provider: providerEnum.Spotify,
                type: musicEnum.Track,
            });
        });

        test('Spotify playlist', async () => {
            expect(
                await _SearchService.resolveProvider('https://open.spotify.com/playlist/37i9dQZF1EIXZX3iPZenSk')
            ).toStrictEqual({
                provider: providerEnum.Spotify,
                type: musicEnum.Playlist,
            });
        });

        test('Spotify album', async () => {
            expect(
                await _SearchService.resolveProvider('https://open.spotify.com/album/0tUUX9X5xhonVyCPXmHLDf')
            ).toStrictEqual({
                provider: providerEnum.Spotify,
                type: musicEnum.Album,
            });
        });
    });
});
