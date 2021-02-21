import React, {useState, useEffect} from 'react';
import { iSong, iAlbum, getAlbumList, getSongList } from '../fetchers';
import { chooseSong, scrambleList } from '../helpers';
import AudioComponent from './AudioComponent';
import styles from '/src/components/Container.module.css';

let listLength: number;
let scrambledList: Array<Array<iSong>>;


const Parent: React.FC = () => {
    const [albums, setAlbums] = useState<Array<iAlbum>>([]);
    const [songs, setSongs] = useState<Array<iSong>>([]);
    const [mode, setMode] = useState<string>('');
    const [counter, setCounter] = useState<number>(0);

    const player = document.querySelector('audio');

    useEffect(() => {
        getAlbumList(setAlbums);
        getSongList(setSongs);
    }, []);

    const playAllSongs = (): void => {
        setMode('playAll');
        scrambledList = scrambleList(songs);
        listLength = scrambledList.length;
        player?.setAttribute('src', scrambledList[counter][0].url);
        player?.load();
        player?.play();
        setCounter(counter + 1);
    }

    player?.addEventListener('ended', () => {
        if (mode === 'playAll' && counter < listLength) {
            player?.setAttribute('src', scrambledList[counter][0].url);
            player.load();
            player.play();
            setCounter(counter + 1);
        }
    })

    const playSong = (song: iSong): void => {
        const player = document.querySelector('audio');
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
                <div
                    className={styles.albumCard} 
                    key={album.title}
                    >
                    <div className={styles.coverSpace} style={albumStyle}></div>
                    <div className={styles.albumInfo} onClick= {() => playSong(targetSong)}>
                        <div className={styles.albumTitle}>{album.title}</div>
                        <div className={styles.albumArtist}>{album.artist}</div>
                        <div>{album.year}</div>
                        <div className={styles.songName}>{targetSong ? `${targetSong.Title}` : ''}</div>
                    </div>
                    
                </div>
            )
    });

    return (
        <>
            <AudioComponent playAll={() => playAllSongs()} />
            {mode !== 'playAll' ? 
                <>
                    <div className={styles.container}>
                        {albumElements}
                    </div>
                </> : null
            }
        </>
    )
};

export default Parent;
