import Typography from '@mui/material/Typography';
import RecommendTable from "./recommendTable"
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import {DashBoardState} from "../../types/dashboard";
import { getRecommendations } from "../../spotifyAPIs";


interface Props {
    dashboardState : DashBoardState
}

export default async function Recommendations(props: Props) {
    const session = await getServerSession(authOptions);
    const access_token = session?.accessToken ? session?.accessToken : ""
    const result = await getRecommendations(access_token, props.dashboardState.trackState.data)
    if (result.timer > 0) {
        console.log('here')
        setTimeout(()=> {result.timer})
    }

    return (
        <>
          <Typography variant="h5" fontWeight={300} 
            sx={{paddingTop: 3, marginLeft: 4}}>
            Your <span style={{color:'lightgreen'}}>Recommendations</span>
            </Typography>
            <RecommendTable recommended={result} access_token={access_token}/>
            
           
        
        </>
    )
}