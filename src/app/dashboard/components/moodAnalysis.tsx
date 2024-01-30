"use client";
import React from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import MoodBadOutlinedIcon from '@mui/icons-material/MoodBadOutlined';
import Slider from '@mui/material/Slider';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import {FeatureScoresInterface, ValenceCount} from "../types/dashboard";
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';
import FlashOffOutlinedIcon from '@mui/icons-material/FlashOffOutlined';
import { PieChart } from '@mui/x-charts/PieChart';
import "../../globals.css";

interface Props {
    status: boolean,
    data: FeatureScoresInterface,
    count: ValenceCount[]
}

const elementExplains: {[key: string]: string }= {
    'valence': 'Positivity/Valence describes the musical postitiveness conveyed by a track. High valence sounds happier, cheerful, while, low valence sounds sad and depressed',
    'danceability': 'Danceability is a measure of how suitable a track is for dancing using combination of musical elements including tempo, rhythm, stability, beat, overall regularity',
    'energy': 'Energy is a measure of how a track feels. This measure use a different elements, including dynamic range, perceived loudness, timbre, onset rate, and entropy.',
}

export default function MoodGraphs(props: Props) {
    const [hoverElement, setHoverElement] = React.useState<string>('');
    const [elementExplaination, setElementExplaination] =  React.useState<string>(elementExplains['valence']);

    React.useEffect(()=> {
        const result = hoverElement === '' ?  elementExplains['valence'] : elementExplains[hoverElement];
        setElementExplaination(result);
    }, [hoverElement])

    const hoverElementChange = (enter: boolean, element: string) => {
        const result = !enter ?  '' : element;
        setHoverElement(result);
    }


    return (
        <Grid item xs={12} md={4} width="30%" mx={'auto'}>
            <Typography textAlign="center" variant="h4">
                Your current <span style={{color:'lightgreen'}}>vibes</span>
            </Typography>
            <Stack sx={{marginTop: 5, paddingX: 8}}>
                <Tooltip 
                    onMouseEnter={()=> {hoverElementChange(true, 'valence')}}
                    onMouseLeave={()=> {hoverElementChange(false, 'valence')}}
                    sx={{fontSize: 18}}
                    title={"Postivity: " + props.data?.valence.toFixed(2)} 
                    arrow>
                    <Stack spacing={2} direction="row" sx={{ mb: 5, mt:3 }} alignItems="center">
                        <MoodBadOutlinedIcon />
                            <Slider aria-label="valence" valueLabelDisplay="on" 
                            className={Math.round(props.data?.valence) > 50 ? 'slider-pass' : 'slider-fail'}
                            disabled defaultValue={Math.round(props.data?.valence)}
                            />
                        <EmojiEmotionsOutlinedIcon />
                    </Stack>
                </Tooltip>
                <Tooltip 
                    onMouseEnter={()=> {hoverElementChange(true, 'danceability')}}
                    onMouseLeave={()=> {hoverElementChange(false, 'danceability')}}
                    sx={{fontSize: 18}}
                    title={"danceability: " + props.data?.danceability.toFixed(2)} 
                    arrow>
                    <Stack spacing={2} direction="row" sx={{ mb: 6 }} alignItems="center">
                        <NotInterestedOutlinedIcon />
                            <Slider aria-label="danceability" 
                            className={Math.round(props.data?.danceability) > 50 ? 'slider-pass' : 'slider-fail'}
                            valueLabelDisplay="on"
                            disabled defaultValue={Math.round(props.data?.danceability)}/>
                        <CelebrationOutlinedIcon />
                    </Stack>
                </Tooltip>
                <Tooltip 
                    onMouseEnter={()=> {hoverElementChange(true, 'energy')}}
                    onMouseLeave={()=> {hoverElementChange(false, 'energy')}}
                    sx={{fontSize: 18}}
                    title={"Energy: " + props.data?.energy.toFixed(2)} 
                    arrow>
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <FlashOffOutlinedIcon />
                            <Slider aria-label="energy" valueLabelDisplay="on" 
                            className={Math.round(props.data?.energy) > 50 ? 'slider-pass' : 'slider-fail'}
                            disabled defaultValue={Math.round(props.data?.energy)}/>
                        <ElectricBoltOutlinedIcon />
                    </Stack>
                </Tooltip>
                <Box sx={{marginTop:4, borderRadius: '16px', 
                    backgroundColor: "lightgray", maxHeight: '20%', height: '20%',
                    opacity: hoverElement !== '' ? 1: 0}}>
                    <Typography sx={{color: "black", margin: 2}}>
                        {elementExplaination}
                    </Typography>
                </Box>
                <Typography textAlign="center" variant="h6" 
                sx={{marginTop: 6, marginBottom:3, color: "white", fontWeight: 100}}>
                Breakdown of your top songs based on <span style={{color:'lightgreen'}}>Valence</span>
                </Typography>
                <PieChart
                sx={{marginRight: 5, marginBottom: 5}}
                    width={400}
                    height={200}
                    series={[
                        {
                            data: props.count,
                            innerRadius: 80,
                            outerRadius: 100,
                            paddingAngle: 5,
                            cornerRadius: 5, 
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        }]}
                    />
                </Stack>
        </Grid>
    )
}
