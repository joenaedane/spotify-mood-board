"use client";
import React from "react";
import {callPlay} from "../../spotifyAPIs"

interface Props {
    isPlay: boolean
    deviceID: string
    token: string
    trackID: string
    setIsPlay: (isPlay: boolean) => void
    setIsError: any 
    currentPlayingTrack: string
    setCurrentPlayingTrack: any
}

export default function PlayButton(props: Props) {
    const [localPlay, setLocalPlay] = React.useState<boolean>(false);

    const playSong = () => {
        if (!props.isPlay) {
            // play song
            callPlay(props.deviceID, props.token, props.trackID).then(
                (playing: any)=> {
                    if (!playing) {
                        return props.setIsError(true)
                    }
                    props.setIsPlay(!props.isPlay)
                    setLocalPlay(true);
                    props.setCurrentPlayingTrack(props.trackID)
                    return 
                }
            );
        } else {
                console.log('stop the song')
                props.setIsPlay(!props.isPlay)
                setLocalPlay(false);
                props.setCurrentPlayingTrack('');
                return;
                }
        }
    
    return ( 
    <button onClick={playSong} disabled={props.currentPlayingTrack === props.trackID && !props.isPlay}>
        {localPlay ? 'Pause' : 'Play'}
    </button>
    )

}