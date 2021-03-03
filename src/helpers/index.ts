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

export const sortAlbumArtistYear = (albumList: Array<iAlbum>): Array<iAlbum> => {
    const holderArray: Array<iAlbum> = [];
    const holderObj:Record<string, Array<iAlbum>> = {};
    const listSize = albumList.length;
    for (let i = 0; i < listSize; i++) {
        const artistName: string = albumList[i].displayName || albumList[i].artist;
        if (artistName in holderObj) {
            holderObj[artistName].push(albumList[i]);
        } else {
            holderObj[artistName] = [albumList[i]];
        }
    }
    for (const artist in holderObj) {
        holderObj[artist].sort((album1: iAlbum, album2: iAlbum) => (album1.year - album2.year));
    }
    const artistArray: Array<string> = Object.keys(holderObj).sort((name1, name2) => name1.localeCompare(name2));
    artistArray.forEach(artist => {
        holderArray.push(...holderObj[artist]);
    })
    return holderArray;
}