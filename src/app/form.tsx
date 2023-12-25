"use client";

import { useEffect, useState } from "react";
import * as Spotify from "spotify-api.js";
import { pushTrack, searchTracks } from "./actions";
import { TrackHeader, TrackItem } from "./track_list";
import { useRouter } from "next/navigation";

export default function Form() {
  const router = useRouter();
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
    setQuery("");
    router.refresh();
  }

  return (
    <form>
      <h1>Add a song</h1>
      <input
        placeholder="Search song name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <>
          <table>
            <thead>
              <TrackHeader />
            </thead>
            <tbody>
              {results.map((track, index) => (
                <TrackItem
                  index={index}
                  key={track.id}
                  track={track}
                  onClick={() => onTrackClick(track)}
                />
              ))}
            </tbody>
          </table>
        </>
      )}
    </form>
  );
}
