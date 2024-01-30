"use client";
import Typography from '@mui/material/Typography';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {RecommendationState} from "../../types/dashboard";
import WebPlayback from "../spotitfyPlayer/webPlayer";
import Avatar from '@mui/material/Avatar';
import PlayButton from "../spotitfyPlayer/playButton"
interface Props {
    recommended : RecommendationState
    access_token: string
}

export default function RecommendTable(props: Props) {
    const [deviceid, setDeviceId] = React.useState<string>('');
    const [isPlay, setIsPlay] = React.useState<boolean>(false);
    const [currentPlayingTrack, setCurrentPlayingTrack] = React.useState<string>("");
    const [isError, setIsError] = React.useState<boolean>(false);

    const columns: GridColDef[] = [
        { field: 'image', headerName: '', width: 60, renderCell: (params)=>{
            return (<Avatar src={params.value.url} />);
          } },
        { field: 'name', headerName: 'Song Name', flex: 1, },
        { field: 'artists', headerName: 'Artist', flex: 1},
        {field: '', headerName: '', width:60, renderCell: (params)=>{
            return (<PlayButton 
                trackID={params.row.id}
                currentPlayingTrack={currentPlayingTrack}
                setCurrentPlayingTrack={setCurrentPlayingTrack}
                setIsError={setIsError}
                isPlay={isPlay} 
                setIsPlay={setIsPlay}
                deviceID={deviceid} 
                token={props.access_token}/>)}}
        
      ];
    return (
        <Box sx={{marginLeft: 4, paddingRight: 5, marginBottom: 5}}>
            <WebPlayback token={props.access_token} setDeviceId={setDeviceId}/>
        {
            isError && <> Unable to play or pause song </>
        }
            {props.recommended.timer == 0 ?
                <DataGrid sx={{ height: 400, width: '100%' }}
                rows={props.recommended.recommendedState} columns={columns}/> :
                <Typography variant="subtitle2" fontWeight={300} sx={{paddingTop: 3}}>
                    There are too many request. Please try again later.
                </Typography>
            }
        </Box>
    )
}