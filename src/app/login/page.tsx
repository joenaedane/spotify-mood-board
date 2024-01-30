"use client";
import { signIn } from "next-auth/react";
import SPOT from "../../../public/SPOT.svg";
import Image from "next/image";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';


  export function Login() {
    const handleClick = () => {
      signIn("spotify");
    };
  
    return (
      <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh"}}>
        <Stack spacing={2}>
          <Typography textAlign="center" variant="h3" color="#1ED760">
            Sign In
          </Typography>
          <Typography textAlign="center" fontWeight={150} variant="h6">
            Check your vibes
          </Typography>
          <Button variant="outlined" sx={{color: 'white'}} size="large" onClick={()=> {handleClick();}}>
            <Image src={SPOT} alt="Spotify Logo" width={20} height={20} style={{marginRight: '1rem'}}/>
            <span> Continue with Spotify!</span>
          </Button>
        </Stack>
        
      </Box>
    );
  }