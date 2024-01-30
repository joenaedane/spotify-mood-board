"use client";
import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {TrackInterface} from "../types/dashboard";
import Avatar from '@mui/material/Avatar';


interface Props {
    status: boolean,
    data: TrackInterface[]
    access_token: string

}

export default function TopSongs(props: Props) {
    const columns: GridColDef[] = [
        { field: 'image', headerName: '', width: 60, renderCell: (params)=>{
            return (<Avatar src={params.value} />);
          } },
        { field: 'name', headerName: 'Song Name', flex: 1, cellClassName: 'songs--cell' },
        { field: 'artists', headerName: 'Artist', flex: 1, cellClassName: 'artist--cell' }
    ];
    
    return (
        <Grid container direction="row" width="100%">
            <Grid item>
            <Typography variant="h5" fontWeight={300}
                sx={{
                    textOrientation: 'upright', 
                    writingMode: 'vertical-lr'}}>
                Top  <span style={{color:'lightgreen'}}>50</span> Songs
            </Typography>
            </Grid>
            <Grid item xs={11} sx={{
                '& .songs--cell': {
                    color: "lightgreen"
                },
                '& .artist--cell': {
                    color: "darkgray"
                }
            }}>
                {!props.status ?
                    <> Unable to retrieve your top songs </> :
                    <DataGrid sx={{ height: 400, width: '100%' }}
                    rows={props.data} columns={columns}
                />
                }
                
            </Grid>
        </Grid>
        
       

    )
}