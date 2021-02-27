import React, {useState, useEffect} from 'react';
import { iSong, iAlbum, iAugmentedSong } from '../interfaces';
import { Modes } from '../enums';
import { getAlbumList, getSongList } from '../fetchers';
import { scrambleList, getAlbumInfo } from '../helpers';
import AudioComponent from './AudioComponent';
import AlbumCard from './AlbumCard';
import styles from '/src/components/Container.module.css';

let listLength: number;
let albumLength: number;
let scrambledList: Array<iSong>;
let albumSongs: Array<iSong>;
let myCounter = 0;
let mode = Modes.off;
let eventTime = '';
// let currentAlbum = null;


const Container: React.FC = () => {
    const [albums, setAlbums] = useState<Array<iAlbum>>([]);
    const [songPlaying, setSongPlaying] = useState<iAugmentedSong | iSong | null>(null);
    const [nextSong, setNextSong] = useState<iSong | null>(null);
    const [songs, setSongs] = useState<Array<iSong>>([]);
    const [isPaused, setisPaused] = useState<boolean>(false);
    // const [mode, setMode] = useState<string>('off');
    // const [counter, setCounter] = useState<number>(0);

    const player = document.querySelector('audio');

    useEffect(() => {
        getAlbumList(setAlbums);
        getSongList(setSongs);
    }, []);

    const playAllSongs = (): void => {
        myCounter = 0;
        mode = Modes.playAll;
        scrambledList = scrambleList(songs);
        listLength = scrambledList.length;
        setSongPlaying(getAlbumInfo(albums, scrambledList[myCounter]));
        setNextSong(scrambledList[myCounter+1]);
        player?.setAttribute('src', scrambledList[myCounter].url);
        player?.play()
            .then(() => {
                myCounter += 1;
            })
            .catch((err) => {console.log('ERR1: ', err)});
    }

    const startAlbum = (songList: Array<iSong>): void => {
        const songInfo = getAlbumInfo(albums, songList[0]);
        setSongPlaying(songInfo);
        setNextSong(songList[1]);
        player?.setAttribute('src', songList[0].url);
        player?.play()
            .then(() => {myCounter += 1;})
            .catch((err) => {console.log('ERR@: ', err)});
    }

    const prepareAlbum = (songList: Array<iSong>): Array<iSong> => {
        albumSongs = songList;
        const songArray = Array.from(songList);
        if (mode === Modes.fullAlbum) {
            songArray.sort((song1, song2) => song1["Album Order"] - song2["Album Order"]);
            return songArray;
        } else if (mode === Modes.shuffledAlbum) {
            console.log('inscramble');
            return scrambleList(songArray);
        } else {
            console.log ('Not an album!');
            return songList;
        }
    }

    const playAlbum = (albumSongs: Array<iSong>): void => {
        mode = Modes.fullAlbum;
        startAlbum(prepareAlbum(albumSongs));
    };

    player?.addEventListener('pause', () => {
        setisPaused(true);
    })
    
    player?.addEventListener('play', () => {
        setisPaused(false);
    })
    
    player?.addEventListener('ended', (e) => {
        if (eventTime === e.timeStamp.toPrecision(5)) {
            return
        } else {
            eventTime = e.timeStamp.toPrecision(5)
        }
        console.log('switch: ', mode);
        switch (mode) {
            case Modes.playAll:
                if (myCounter < listLength) {
                    setSongPlaying(getAlbumInfo(albums, scrambledList[myCounter]));
                    setNextSong(scrambledList[myCounter+1]);
                    player?.setAttribute('src', scrambledList[myCounter].url);
                    player?.play()
                        .then(() => {
                            myCounter += 1;
                        })
                        .catch((err) => {console.log('ERR3: ', err)});
                }
                break;
            case Modes.fullAlbum:
                if ( myCounter < albumLength) {

                    const songInfo = getAlbumInfo(albums, albumSongs[myCounter]);
                    setSongPlaying(songInfo);
                    setNextSong(albumSongs[myCounter + 1]);
                    player?.setAttribute('src', albumSongs[myCounter].url)
                    player?.play()
                        .then(() => {
                            myCounter += 1;
                        })
                        .catch((err) => {console.log('ERR4: ', err)});
                }
                break;
            default:
                break;
        }
    })

    const togglePlayPause = (): void => {
        if (isPaused) {
            player?.play();
        } else {
        player?.pause();
        }
    }

    const shuffleAlbum = (): void => {
        mode = Modes.shuffledAlbum;
        startAlbum(prepareAlbum(albumSongs));
    }

    const albumElements: JSX.Element[] = albums
        .sort((album1, album2) => (album1.displayName || album1.artist).localeCompare(album2.displayName || album2.artist))
        .map((album: iAlbum) => {
            const albumStyle = {
                backgroundImage: `url(${album.cover})`,
                backgroundSize: "contain"
            }
            return (
                <AlbumCard
                    key={`${album.artist}${album.title}`} 
                    year={album.year}
                    artist={album.artist}
                    album={album.title}
                    albumStyle={albumStyle}
                    albumPlay = {() => playAlbum(album.songs)}
                />
            )
    });

    return (
        <>
            <AudioComponent nextSong={nextSong}
                togglePlayPause={() => togglePlayPause()}
                shuffleAlbum={() => shuffleAlbum()}
                currentSong={songPlaying}
                playAll={() => playAllSongs()}
                isPaused={isPaused}
            />
            <div className={styles.container}>
                {albumElements}
            </div>
        </>
    )
};

export default Container;
