import React from 'react';
import { iAudioCompProps } from '../interfaces';
import RoundButton from './RoundButton';
import styles from '/src/components/AudioComponent.module.css';


const AudioComponent: React.FC<iAudioCompProps> = (props:iAudioCompProps) => (
    <>
        <audio id={styles.audioPlayer} cross-origin="true" autoPlay src="">
            Audio player not supported by browser!
        </audio>
        <div className={styles.playerFace}>
            <div className={styles.topLevel}>
                <button
                    onClick={props.playAll} 
                    className={styles.playButtons}
                    id={styles.shufflePlay}>
                    Shuffle All &amp; Play
                </button>
            </div>
            <div className={styles.infoSpace}>
                <div className={styles.nowPlaying}>
                    {
                        props.currentSong ?
                        <><div className={styles.songTitle}>You&apos;re hearing: <span className={styles.titleText}>{props.currentSong.Title}</span></div>
                        <div className={styles.songArtist}>by <span className={styles.titleText}>{props.currentSong && props.currentSong.artist} ({props.currentSong && props.currentSong.year})</span></div></> :
                        null
                    
                    }
                </div>
                <div className={styles.upNext}>
                    {
                        props.nextSong ? 
                        <><div className={styles.songTitle}>Next Up: <span className={styles.titleText}>{props.nextSong.Title}</span></div></> :
                        null
                    }
                </div>
            </div>
            <div className={styles.bottomLevel}>
                <RoundButton text={props.isPaused ? "Play" : "Pause"} action={props.togglePlayPause} />
                <RoundButton text="Shuffle" action={props.shuffleAlbum} />
            </div>
        </div>
        
    </>
)


export default AudioComponent;