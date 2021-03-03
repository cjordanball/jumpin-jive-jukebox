import React, {useState, useEffect} from 'react';
import { iSong, iAlbum, iAugmentedSong } from '../interfaces';
import { Modes } from '../enums';
import { getAlbumList, getSongList } from '../fetchers';
import { scrambleList, getAlbumInfo, sortAlbumArtistYear } from '../helpers';
import AudioComponent from './AudioComponent';
import AlbumCard from './AlbumCard';
import styles from '/src/components/Container.module.css';

// let listLength: number;
let albumLength: number;
let albumSongs: Array<iSong>;
let preppedAlbum: Array<iSong>;
let songCounter = 0;
let mode = Modes.off;
let eventTime = '';


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
        mode = Modes.shuffledAlbum;
        playAlbum(songs);
    }

    const prepareAlbum = (songList: Array<iSong>): Array<iSong> => {
        songCounter = 0;
        const songArray = Array.from(songList);
        if (mode === Modes.fullAlbum) {
            songArray.sort((song1, song2) => song1["Album Order"] - song2["Album Order"]);
            return songArray;
        } else if (mode === Modes.shuffledAlbum) {
            return scrambleList(songArray);
        } else {
            console.log ('Not an album!');
            return songList;
        }
    }

    const playNextSong = (songList: Array<iSong>, index: number): void => {
        if (index >= albumLength) {
            setSongPlaying(null);
            setNextSong(null);
            return;
        }
        const songInfo = getAlbumInfo(albums, songList[index]);
        setSongPlaying(songInfo);
        setNextSong(songList[index + 1]);
        player?.setAttribute('src', songList[index].url);
        player?.play()
            .then(() => { return; })
            .catch((err) => {console.log('ERR2: ', err)});
    }

    const selectAlbum = (songList: Array<iSong>): void => {
        albumSongs = Array.from(songList);
        mode = Modes.fullAlbum;
        playAlbum(songList);
    }

    const shuffleAlbum = (songList: Array<iSong>): void => {
        if (songList) {
            if ([Modes.shuffledAlbum, Modes.fullAlbum].includes(mode)) {
                mode = Modes.shuffledAlbum;
            }
            playAlbum(songList);
        }
        else {
            alert('You have to select an album first!')
        }
    }

    const playAlbum = (songList: Array<iSong>): void => {
        songCounter = 0;
        albumLength = songList.length;
        preppedAlbum = prepareAlbum(songList);
        playNextSong(preppedAlbum, songCounter);
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
        songCounter += 1;
        playNextSong(preppedAlbum, songCounter);
    });

    const togglePlayPause = (): void => {
        if (isPaused) {
            player?.play();
        } else {
        player?.pause();
        }
    }

    const albumElements: JSX.Element[] = sortAlbumArtistYear(albums)
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
                    albumPlay = {() => selectAlbum(album.songs)}
                />
            )
    });

    return (
        <>
            <AudioComponent nextSong={nextSong}
                togglePlayPause={() => togglePlayPause()}
                shuffleAlbum={() => shuffleAlbum(albumSongs)}
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
