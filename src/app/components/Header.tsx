import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SettingButton from "./SettingButton";



export default async function Header() {
  const session = await getServerSession(authOptions);
  const userImage = session?.user?.image ? session?.user?.image : '';
  const userName = session?.user?.name ? session?.user?.name : '';
    return (
      <AppBar position='static'>
        <Container maxWidth="xl"> 
        <Toolbar disableGutters >
          <Box sx={{ flexGrow: 9, display: 'flex'}}>
            <Avatar alt="Spotify Logo" src="SPOT.svg" 
                sx={{
                  maxWidth: 20, maxHeight: 20
                }}
              />
              <Typography
                noWrap
                component="a"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  ml: 2, 
                  fontFamily: 'Helvetica Neue',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
              MOOD BOARD
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <SettingButton image={userImage} userName={userName}/>
          </Box>
          </Toolbar>
        </Container>

      </AppBar>
    );
  }
