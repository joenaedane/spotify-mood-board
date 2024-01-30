"use client";
import React from "react";
import {callPlay, pausePlay} from "../../spotifyAPIs"
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import PauseIcon from '@mui/icons-material/Pause';

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
        props.setIsError(false);
        if (!props.isPlay) {
            // play song
            callPlay(props.deviceID, props.token, props.trackID).then(
                (playing: any)=> {
                    if (!playing) {
                     props.setIsError(true)
                     return
                    }
                    props.setIsPlay(!props.isPlay)
                    setLocalPlay(true);
                    props.setCurrentPlayingTrack(props.trackID)
                    return; 
                }
            );
        } else {
                console.log('stop the song')
                pausePlay(props.token, props.deviceID).then(
                    (response) => {
                        if (!response) {
                            props.setIsError(true)
                            return
                           }
                           props.setIsPlay(!props.isPlay)
                           setLocalPlay(false);
                           props.setCurrentPlayingTrack('');
                           return;

                    }
                )
               
                }
    }
    
    return ( 
        <>
        {props.isPlay && props.currentPlayingTrack === props.trackID &&
        <div onClick={playSong} >
            <PauseIcon />
        </div> 
        }   
        {!props.isPlay &&
            <div onClick={playSong} >
                <PlayCircleOutlinedIcon />
            </div> 
        }
        </>
    
    )

}