import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getMood } from "./spotifyAPIs";
import TopSongs from "./components/topSongs";
import Grid from '@mui/material/Grid';
import MoodGraphs from "./components/moodAnalysis";
import Recommendations from "./components/recommendations/recommendations";



export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    const access_token = session?.accessToken ? session?.accessToken : ""
    const dashBoardState = await getMood(access_token);
  
    return (
      <Grid container justifyItems="flex-start"
        spacing={2} sx={{marginTop: 4, 
          marginLeft: '0 !important', width: '100vw'}}
          direction="row"
        >
        <Grid container direction="column" justifyItems="flex-start" xs={12} md={6}>
            <Grid item xs={6}>
            
              <TopSongs 
                status={dashBoardState.trackState.status} 
                data={dashBoardState.trackState.data} 
                access_token={access_token}
              />
              <Recommendations 
                dashboardState={dashBoardState}
              />
            </Grid>
        </Grid>
        <MoodGraphs 
                status={dashBoardState.featureResults.status} 
                data={dashBoardState.featureResults.data} 
                count={dashBoardState.featureResults.count}
              />      
      </Grid>
    );
  }
  