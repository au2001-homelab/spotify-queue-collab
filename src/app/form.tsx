"use client";

import { useEffect, useState } from "react";
import * as Spotify from "spotify-api.js";
import { pushTrack, searchTracks } from "./actions";
import Track from "./track";

export default function Form() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Spotify.Track[]>([]);

  useEffect(() => {
    if (query === "") {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchTracks(query).then(setResults).catch(console.error);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  async function onTrackClick(track: Spotify.Track) {
    await pushTrack(track.uri);
    window.location.reload();
  }

  return (
    <form>
      <h1>Add a song</h1>
      <input
        placeholder="Search song name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.map((track) => (
        <Track
          key={track.id}
          track={track}
          onClick={() => onTrackClick(track)}
        />
      ))}
    </form>
  );
}
