import { getServerSession } from "next-auth";
import { authOptions, loginIsRequiredServer } from "./api/auth/[...nextauth]/route";
import Dashboard from "./dashboard/page";
import {Login} from "./login/page";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';


export default async function Landing() {
  const session = await getServerSession(authOptions);
  console.log(session?.accessToken)
  return (
    <Container maxWidth="lg" sx={{margin: 0, 
    justifyContent: "center", 
    alignItems: "center"}}>
      {session?.user && session?.accessToken ? 
        <Dashboard /> : 
          <Box sx={{
            justifyContent: 'center'
          }}>
            <Login />
          </Box>
      }
    </Container>
  );
}
