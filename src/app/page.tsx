import { getServerSession } from "next-auth";
import { authOptions, loginIsRequiredServer } from "./api/auth/[...nextauth]/route";
import Dashboard from "./dashboard/page";
import {Login} from "./login/page";
import Box from '@mui/material/Box';


export default async function Landing() {
  const session = await getServerSession(authOptions);
  console.log(session?.accessToken)
  return (
    <Box>
      {session?.user && session?.accessToken ? 
        <Dashboard /> : 
          <Box display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          >
            <Login />
          </Box>
      }
    </Box>
  );
}
