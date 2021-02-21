import { iSong } from '../fetchers';

export const chooseSong = (count: number): number => {
    return Math.floor(Math.random() * count);
};

export const scrambleList = (songList: Array<iSong>): Array<Array<iSong>> => {
    let arrayLength = songList.length;
    const scrambledArray = [];
    const listCopy = Array.from(songList);

    while (arrayLength) {
        const target = Math.floor(Math.random() * arrayLength);
        scrambledArray.push(listCopy.splice(target, 1));
        arrayLength -= 1;
    }
    return scrambledArray;
}