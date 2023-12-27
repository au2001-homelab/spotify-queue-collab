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

export async function pushTrack(uri: string): Promise<boolean> {
  const spotify = await getSpotify();
  if (spotify === null) return false;

  return await spotify.user.player.addItem(uri);
}
