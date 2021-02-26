import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/database';
import { firebaseConfig } from '../aux/keys';
import { iAlbum, iRawAlbum, iSong } from '../interfaces';

const app = firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.database(app);

export const getAlbumList = (setAlbums: React.Dispatch<React.SetStateAction<Array<iAlbum>>>):void => {
    const albumsRef = db.ref().child('ALBUMS');
    const query = albumsRef
        .orderByChild('Title');
    query.on('value', snap => {
        const fetchedAlbums = snap.val().map((album: iRawAlbum): iAlbum => {
            return {
                cover: album.Cover,
                artist: album.Artist,
                year: album.Year,
                title: album.Title,
                songs: album.Songs,
                displayName: album.DisplayName
            }
        });
        setAlbums(fetchedAlbums);
    });    
};

export const getSongList = (setSongs: React.Dispatch<React.SetStateAction<Array<iSong>>>):void => {
    const albumsRef = db.ref().child('ALBUMS');
    const query = albumsRef
        .orderByChild('Title');
    query.on('value', snap => {
        const songs:Array<iSong> = [];
        snap.val().forEach((album: iRawAlbum): void=> {
            songs.push(...album.Songs);
        });
        setSongs(songs);
    })
};