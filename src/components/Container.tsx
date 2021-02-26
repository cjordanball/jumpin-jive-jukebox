import React, {useState, useEffect} from 'react';
import { iSong, iAlbum, iAugmentedSong } from '../interfaces';
import { getAlbumList, getSongList } from '../fetchers';
import { chooseSong, scrambleList, getAlbumInfo } from '../helpers';
import AudioComponent from './AudioComponent';
import AlbumCard from './AlbumCard';
import styles from '/src/components/Container.module.css';

let listLength: number;
let albumLength: number;
let scrambledList: Array<Array<iSong>>;
let albumSongs: Array<iSong>;
let myCounter = 0;
let mode = '';
let eventTime = '';


const Parent: React.FC = () => {
    const [albums, setAlbums] = useState<Array<iAlbum>>([]);
    const [songPlaying, setSongPlaying] = useState<iAugmentedSong | iSong | null>(null);
    const [nextSong, setnextSong] = useState<iSong | null>(null);
    const [songs, setSongs] = useState<Array<iSong>>([]);
    // const [mode, setMode] = useState<string>('');
    // const [counter, setCounter] = useState<number>(0);

    const player = document.querySelector('audio');

    useEffect(() => {
        getAlbumList(setAlbums);
        getSongList(setSongs);
    }, []);

    const playAllSongs = (): void => {
        myCounter = 0;
        mode = 'playAll';
        scrambledList = scrambleList(songs);
        listLength = scrambledList.length;
        setSongPlaying(getAlbumInfo(albums, scrambledList[myCounter][0]));
        setnextSong(scrambledList[myCounter+1][0]);
        player?.setAttribute('src', scrambledList[myCounter][0].url);
        player?.play()
            .then(() => {
                myCounter += 1;
            })
            .catch((err) => {console.log('ERR1: ', err)});
    }

    const playAlbum = (chosenAlbumSongs: Array<iSong>): void => {
        albumSongs = chosenAlbumSongs;
        myCounter = 0;
        mode = 'fullAlbum';
        albumLength = albumSongs.length;
        albumSongs.sort((song1, song2) => song1["Album Order"] - song2["Album Order"]);
        const songInfo = getAlbumInfo(albums, albumSongs[0]);
        setSongPlaying(songInfo);
        setnextSong(albumSongs[1]);
        player?.setAttribute('src', albumSongs[0].url);

        player?.play()
            .then(() => {
                myCounter += 1;
            })
            .catch((err) => {console.log('ERR2: ', err)});
    }

    player?.addEventListener('ended', (e) => {
        if (eventTime === e.timeStamp.toPrecision(5)) {
            return
        } else {
            eventTime = e.timeStamp.toPrecision(5)
        }
        switch (mode) {
            case 'playAll':
                if (myCounter < listLength) {
                    setSongPlaying(getAlbumInfo(albums, scrambledList[myCounter][0]));
                    setnextSong(scrambledList[myCounter+1][0]);
                    player?.setAttribute('src', scrambledList[myCounter][0].url);
                    player?.play()
                        .then(() => {
                            myCounter += 1;
                        })
                        .catch((err) => {console.log('ERR3: ', err)});
                }
                break;
            case 'fullAlbum':
                if ( myCounter < albumLength) {

                    const songInfo = getAlbumInfo(albums, albumSongs[myCounter]);
                    setSongPlaying(songInfo);
                    setnextSong(albumSongs[myCounter + 1]);
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

    const playSong = (song: iSong): void => {
        const player = document.querySelector('audio');
        setSongPlaying(getAlbumInfo(albums, song));
        setnextSong(null);
        player?.setAttribute('src', song.url);
    }

    const albumElements: JSX.Element[] = albums
        .sort((album1, album2) => (album1.displayName || album1.artist).localeCompare(album2.displayName || album2.artist))
        .map((album: iAlbum) => {
            const targetSong = album.songs[chooseSong(album.songs.length)];
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
                    title={targetSong ? `${targetSong.Title}` : ''}
                    albumStyle={albumStyle}
                    albumPlay = {() => playAlbum(album.songs)}
                    songPlay = {() => playSong(targetSong)}
                />
            )
    });

    return (
        <>
            <AudioComponent nextSong={nextSong} currentSong={songPlaying} playAll={() => playAllSongs()} />
            <div className={styles.container}>
                {albumElements}
            </div>
        </>
    )
};

export default Parent;
