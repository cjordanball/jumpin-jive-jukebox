export interface iRawAlbum {
    Cover: string,
    Title: string,
    Year: number,
    Artist: string,
    DisplayName: string,
    Style: string,
    Songs: Array<iSong>,
    Label: string
}

export interface iSong {
    "Album Order": number,
    Length: string,
    Title: string,
    url: string
    "IndexOrder"?: number
}

export interface iAlbum {
    cover: string,
    title: string,
    year: number,
    artist: string,
    displayName: string,
    songs: Array<iSong>
}

export interface iAugmentedSong {
    "Album Order": number,
    Length: string,
    Title: string,
    url: string,
    artist?: string,
    year?: number,
    albumName?: string
}

export interface iAlbumCard {
    year: number,
    artist: string,
    album: string,
    albumStyle: {
        backgroundImage: string,
        backgroundSize: string
    },
    albumPlay: () => void;
}

export interface iRoundButton {
    text: string;
    action?: () => void;
}

export interface iAudioCompProps {
    playAll: () => void;
    currentSong: iAugmentedSong | null;
    nextSong: iSong | null;
    togglePlayPause: () => void;
    shuffleAlbum: () => void;
    isPaused: boolean;
}