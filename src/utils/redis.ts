import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

export async function getSpotifyAccessToken() {
  if (!redis.isOpen) await redis.connect();

  const auth = await redis.get("spotify-auth");
  if (auth === null) return null;

  const { accessToken } = JSON.parse(auth);
  return accessToken;
}

export async function setSpotifyAccessToken(
  accessToken: string,
  refreshToken: string,
  expiration: Date,
) {
  if (!redis.isOpen) await redis.connect();

  return await redis.set(
    "spotify-auth",
    JSON.stringify({
      accessToken,
      refreshToken,
      expiration: expiration.toISOString(),
    }),
  );
}

export default redis;
