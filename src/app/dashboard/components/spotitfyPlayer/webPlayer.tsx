"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Typography from '@mui/material/Typography';

export function loadSpotifyPlayer(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      const scriptTag = document.getElementById("spotify-player");
  
      if (!scriptTag) {
        const script = document.createElement("script");
        script.id = "spotify-player";
        script.type = "text/javascript";
        script.async = false;
        script.defer = true;
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.onload = () => resolve();
        script.onerror = (error: any) =>
          reject(new Error(`loadScript: ${error.message}`));
  
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

function WebPlayback(props: any) {
    const [is_active, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [isInitialized, setInitialized] = useState(false);
    const [isSDKLoaded, setSDKLoaded] = useState(false);

  const initPlayer = useCallback(async () => {
    const spotifyPlayer = new window.Spotify.Player({
      getOAuthToken: (callback: (input: string) => void) => {
        callback(props.token);
      },
      name: "SPOTIFYMOODBOARD",
      volume: 0.5
    });

    // Ready
    spotifyPlayer.addListener("ready", async ({ device_id }: any) => {
      console.log(`Ready with Device ID: ${device_id}`);
      setDeviceId(device_id);
      props.setDeviceId(device_id);
      setActive(true)
    });

    // Not Ready
    spotifyPlayer.addListener("not_ready", ({ device_id }: any) => {
      console.log("Device ID has gone offline", device_id);
    });

    spotifyPlayer.addListener("initialization_error", ({ message }: any) => {
      console.error(message);
    });

    spotifyPlayer.addListener("authentication_error", ({ message }: any) => {
      console.error(message);
    });

    spotifyPlayer.addListener("account_error", ({ message }: any) => {
      console.error(message);
    });
    await spotifyPlayer.connect();
    setInitialized(true);
  }, [props.token]);

  useEffect(() => {
    if (!isSDKLoaded) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("onSpotifyWebPlaybackSDKReady");
        setSDKLoaded(true);
      };
      loadSpotifyPlayer();
    }
  }, [isSDKLoaded]);


  useEffect(() => {
    if (isSDKLoaded && !!props.token && !isInitialized) {
      initPlayer();
    }
  }, [initPlayer, isInitialized, isSDKLoaded, props.token]);

  

    if (!isInitialized) { 
        return (
            <Typography variant="subtitle2" 
            fontWeight={300} sx={{paddingTop: 3}}
            >
                    Setting up player...
                </Typography>)
    } else {
        return (
            <>
              
            </>
        );
    }
}

export default WebPlayback