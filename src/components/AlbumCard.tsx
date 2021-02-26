import React from 'react';
import { iAlbumCard } from '../interfaces';
import styles from './AlbumCard.module.css';


const AlbumCard = (props: iAlbumCard): JSX.Element => (
    <div className={styles.albumCard}>
        <div className={styles.coverSpace} style={props.albumStyle} onClick={props.albumPlay}></div>
        <div className={styles.albumInfo} onClick={props.songPlay}>
            <div className={styles.albumTitle}>{props.album}</div>
            <div className={styles.albumArtist}>{props.artist}</div>
            <div>{props.year}</div>
            <div className={styles.songName}>{props.title}</div>
        </div>
    </div>
)

export default AlbumCard;