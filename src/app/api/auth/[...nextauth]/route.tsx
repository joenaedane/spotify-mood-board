import NextAuth, { NextAuthOptions, Session, getServerSession } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify"
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import {JWT} from 'next-auth/jwt'

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const basicAuth = Buffer.from(`${ process.env.SPOTIFY_CLIENT_ID}:${ process.env.SPOTIFY_CLIENT_SECRET}`).toString(
      'base64'
    )
    const request = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${basicAuth}`,
            },
            body: `grant_type=refresh_token&refresh_token=${token.refreshToken}`,
            cache: "no-cache"
          });
    const tokens = await request.json();

    if (!request.ok) {
      throw Error;
    }

    return {
      ...token,
      accessToken: tokens.access_token,
      accessTokenExpires: Date.now() + tokens.expires_in * 1000,
    }
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: NextAuthOptions = {
    secret: process.env.AUTH_SECRET,
    providers : [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: {
              params: {
                scope: "user-top-read user-library-read streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state"
              }
            }
        })
    ],
    callbacks: {
      async jwt({ token, account, user }) {
        if (account && user) {
          return {
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            accessTokenExpires: account.expires_at * 1000,
            user,
          }
        } 
        if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
          return token
        }
        const newToken = await refreshAccessToken(token)
        return newToken
      },
      async session({ session, token }) {
        session.accessToken = token.accessToken
        session.expires = token.accessTokenExpires
        session.user = token.user
        return session
      },
    },
    }

export async function loginIsRequiredServer() {
    const session = await getServerSession(authOptions);
    if (!session) return redirect("/login")
    return session;
}

export function loginIsRequiredClient() {
    if (typeof window !== "undefined") {
      const session = useSession();
      const router = useRouter();
      if (!session) router.push("/login");
    }
  }

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};