"use server";

import { getSpotify } from "@/utils/auth";
import { SPOTIFY_MARKET } from "@/utils/constants";

export async function searchTracks(query: string) {
  const spotify = await getSpotify();
  if (spotify === null) return [];

  const tracks = await spotify.tracks.search(query, {
    market: SPOTIFY_MARKET,
  });

  return JSON.parse(JSON.stringify(tracks));
}

export async function pushTrack(uri: string) {
  const spotify = await getSpotify();
  if (spotify === null)
    return Promise.reject(new Error("Spotify API not initialized"));

  if ((await spotify.user.player.addItem(uri)) === true) Promise.resolve();
  else Promise.reject(new Error("Failed to push track"));
}
