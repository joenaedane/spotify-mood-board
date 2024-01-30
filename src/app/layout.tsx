import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/system';
import theme from "@/app/styles/theme";


export const metadata: Metadata = {
  title: "Spotify Mood Board",
  description: "Guess your mood",
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{margin: 0}}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {session?.user && <Header />}
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
