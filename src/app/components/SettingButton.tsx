"use client";
import React, {useState} from "react";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from "@mui/material/Link";
import { signOut } from "next-auth/react";

interface settingProps {
    image: string;
    userName: string;

}

const settings = {
    "dashboard": "/dashboard",
    "sign out": '/api/auth/signout'
};

export default function SettingButton(props: settingProps) {
    const [openSetting, setOpenSetting] = useState<boolean>(false);
    const [showName, setShowName] = useState<boolean>(false);

    return (
        <Box sx={{display: 'flex', alignContent: 'center'}}>
            {(showName || openSetting) &&  
            <Typography textAlign="center" 
                sx={{fontWeight: 300, fontSize: 18, mt: 2, mr: 3}}>
                Hello, {props.userName} </Typography> }
            <IconButton 
                onClick={()=> {setOpenSetting(true);}}
                onMouseOver={()=> {setShowName(true)}}
                onMouseOut={()=> {setShowName(false)}}
            >
                <Avatar 
                alt={props.userName ? props.userName : ""} 
                src={props.image ? props.image : ""} 
                />
            </IconButton>
            <Menu 
                sx={{ mt: '47px', ml: 2, width: '80rem', px: 3}}
                 anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                open={openSetting} 
                onClose={()=> {setOpenSetting(false); setShowName(false)}}
            > 
            <MenuItem>
                <Link href='#' underline="none">
                    <Typography textAlign="center" >
                            Dashboard
                        </Typography>
                </Link>
            </MenuItem>
            <MenuItem>
                <Link href="#" underline="none" 
                onClick={()=> signOut({callbackUrl: 'http://localhost:3000'})}>
                    <Typography textAlign="center" >
                            Sign Out
                    </Typography>
                </Link>
            </MenuItem>
            </Menu>
        </Box>
        
        

            
      
        
    )
}