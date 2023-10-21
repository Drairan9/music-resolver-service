import play, { Spotify, SpotifyAlbum, SpotifyPlaylist, SpotifyTrack, YouTubeVideo } from 'play-dl';
import { musicEnum } from '../../utils/enums';

// const search = async (x: any, y: any): Promise<any> => {
//     return new Promise((resolve, reject) => {
//         resolve([
//             new YouTubeVideo({
//                 id: 'xxx',
//                 url: `https://www.youtube.com/watch?v=xxx`,
//                 title: 'xxx',
//                 description: 'x',
//                 duration: 0,
//                 duration_raw: '0:00',
//                 thumbnails: [
//                     {
//                         url: 'xxx',
//                         width: 2,
//                         height: 2,
//                     },
//                     {
//                         url: 'xxx',
//                         width: 2,
//                         height: 2,
//                     },
//                 ],
//                 channel: {
//                     id: 'xxx',
//                     name: 'xxx',
//                     url: `xxx`,
//                     icons: [],
//                     verified: true,
//                     artist: true,
//                 },
//                 uploadedAt: '2023-03-20T07:00:01-07:00',
//                 upcoming: undefined,
//                 views: 0,
//                 live: false,
//             }),
//         ]);
//     });
// };

const so_validate = async (url: string): Promise<false | musicEnum> => {
    return new Promise((resolve, reject) => {
        switch (url) {
            case 'https://soundcloud.com/hexibase/oho':
                resolve(musicEnum.Track);
            case 'https://soundcloud.com/user-802956580/sets/hexabase':
                resolve(musicEnum.Playlist);
            case 'https://soundcloud.com/hexibase':
                resolve(musicEnum.Search);
            case 'Test query':
                resolve(musicEnum.Search);
            default:
                resolve(false);
        }
    });
};

module.exports = {
    ...jest.requireActual('play-dl'),
    //search,
    so_validate,
};
