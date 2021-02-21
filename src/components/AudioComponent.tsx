import React from 'react';
import styles from '/src/components/AudioComponent.module.css';

interface AudioProps {
    playAll: () => void;
}

const AudioComponent: React.FC<AudioProps> = (props:AudioProps) => (
    <>
        <audio id={styles.audioPlayer} cross-origin="true" autoPlay src="">
            Audio player not supported by browser!
        </audio>
        <div className={styles.playerFace}>
            <button
                onClick={props.playAll} 
                className={styles.playButtons}
                id={styles.shufflePlay}>
                Shuffle All &amp; Play
            </button>
        </div>
    </>
)


export default AudioComponent;