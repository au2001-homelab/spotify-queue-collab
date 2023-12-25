"use server";

import { setSpotifyAccessToken } from "@/utils/redis";
import { REDIRECT_URI } from "./constants";

export async function login(code: string) {
  const body = new URLSearchParams();
  body.set("code", code);
  body.set("redirect_uri", REDIRECT_URI);
  body.set("grant_type", "authorization_code");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET,
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  const json = await res.json();

  if (!res.ok) throw json;

  await setSpotifyAccessToken(
    json.access_token,
    json.refresh_token,
    new Date(Date.now() + json.expires_in * 1000),
  );
}
