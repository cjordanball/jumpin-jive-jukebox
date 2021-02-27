import { iSong, iAlbum, iAugmentedSong} from '../interfaces';

export const scrambleList = (songList: Array<iSong>): Array<iSong> => {
    let arrayLength = songList.length;
    const scrambledArray: Array<iSong> = [];
    const listCopy = Array.from(songList);
    while (arrayLength) {
        const target = Math.floor(Math.random() * arrayLength);
        scrambledArray.push(listCopy.splice(target, 1)[0]);
        arrayLength -= 1;
    }
    return scrambledArray;
}

export const getAlbumInfo = (albumList: Array<iAlbum>, song: iSong): iAugmentedSong => {
    const order = song['IndexOrder'] || song['Album Order'];
    const targetAlbum = albumList.find (album => album.songs[order - 1] && album.songs[order - 1].url === song.url);
    return {
        ...song,
        artist: targetAlbum?.artist,
        year: targetAlbum?.year,
        albumName: targetAlbum?.title
    }
}