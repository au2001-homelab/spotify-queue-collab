import * as Spotify from "spotify-api.js";
import { REDIRECT_URL } from "./constants";
import redis from "./redis";

interface SpotifyAuth extends Spotify.UserTokenContext {
  acquiredAt: string;
}

const client = new Spotify.Client({
  token: {
    clientID: process.env.SPOTIFY_CLIENT_ID ?? "",
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
  },
});

export async function getAccessToken() {
  if (!redis.isOpen) await redis.connect();

  const raw = await redis.get("spotify-auth");
  if (raw === null) return null;

  const { accessToken, refreshToken, expiresIn, acquiredAt } = JSON.parse(
    raw,
  ) as SpotifyAuth;

  if (
    refreshToken !== undefined &&
    new Date(acquiredAt).getTime() + expiresIn * 1000 < Date.now()
  ) {
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

async function saveAccessToken(
  body: { code: string } | { refreshToken: string },
): Promise<SpotifyAuth> {
  const acquiredAt = new Date();

  const token = await client.auth.getUserToken({
    clientID: process.env.SPOTIFY_CLIENT_ID ?? "",
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
    redirectURL: REDIRECT_URL,
    code: "code" in body ? body.code : undefined,
    refreshToken: "refreshToken" in body ? body.refreshToken : undefined,
  });

  const auth = {
    ...token,
    acquiredAt: acquiredAt.toISOString(),
  };

  if ("refreshToken" in body) auth.refreshToken ??= body.refreshToken;

  if (!redis.isOpen) await redis.connect();
  await redis.set("spotify-auth", JSON.stringify(auth));

  return auth;
}

export async function exchangeAccessToken(code: string) {
  return await saveAccessToken({
    code,
  });
}

export async function refreshAccessToken(refreshToken: string) {
  return await saveAccessToken({
    refreshToken,
  });
}

export async function getSpotify() {
  const accessToken = await getAccessToken();
  if (accessToken === null) return null;

  return new Promise<Spotify.Client>((resolve, reject) => {
    new Spotify.Client({
      token: accessToken,
      userAuthorizedToken: true,
      onReady: resolve,
      onFail: reject,
    });
  });
}
