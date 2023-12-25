import * as Spotify from "spotify-api.js";
import { getSpotify } from "./auth";

export async function getQueue() {
  const spotify = await getSpotify();
  if (spotify === null) return null;

  // Spotify-api.js does not support getting the user's queue (yet), so we do it manually
  const queue = await spotify.fetch("/me/player/queue");

  return {
    currentlyPlaying:
      queue.currently_playing?.type === "track"
        ? new Spotify.Track(queue.currently_playing, spotify)
        : null,

    queue: (queue.queue as any[]).flatMap((track) =>
      track.type === "track" ? new Spotify.Track(track, spotify) : [],
    ),
  };
}
