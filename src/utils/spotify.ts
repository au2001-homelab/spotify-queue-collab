import { REDIRECT_URI } from "./constants";
import redis from "./redis";

export async function getAccessToken() {
  if (!redis.isOpen) await redis.connect();

  const auth = await redis.get("spotify-auth");
  if (auth === null) return null;

  const { accessToken, refreshToken, expiration } = JSON.parse(auth);

  if (new Date(expiration) < new Date()) {
    try {
      const { accessToken } = await refreshAccessToken(refreshToken);
      return accessToken;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  return accessToken;
}

export async function setAccessToken({
  access_token: accessToken,
  refresh_token: refreshToken,
  expires_in: expiresIn,
}: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) {
  if (!redis.isOpen) await redis.connect();

  const expiration = new Date(Date.now() + expiresIn * 1000);

  const json = {
    accessToken,
    refreshToken,
    expiration: expiration.toISOString(),
  };

  await redis.set("spotify-auth", JSON.stringify(json));

  return json;
}

async function fetchToken(body: Record<string, string>) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET,
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  const json = await res.json();

  if (!res.ok) throw json;

  return await setAccessToken(json);
}

export async function exchangeAccessToken(code: string) {
  return await fetchToken({
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code,
  });
}

export async function refreshAccessToken(refreshToken: string) {
  return await fetchToken({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}
