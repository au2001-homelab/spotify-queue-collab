"use client";

import { useEffect, useState, FormEvent } from "react";
import * as Spotify from "spotify-api.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pushTrack, searchTracks } from "./actions";
import { TrackHeader, TrackItem } from "./track_list";
import styles from "./search.module.css";
import track_styles from "./track_list.module.css";

enum SearchStatus {
  Init,
  Loading,
  Done,
  Error,
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Spotify.Track[]>([]);
  const [status, setStatus] = useState<SearchStatus>(SearchStatus.Init);

  useEffect(() => {
    if (query === "") {
      setResults([]);
      setStatus(SearchStatus.Init);
      return;
    }

    const abort = new AbortController();

    setResults([]);
    setStatus(SearchStatus.Loading);
    const timeout = setTimeout(() => {
      searchTracks(query)
        .then((results) => {
          if (!abort.signal.aborted) {
            setStatus(SearchStatus.Done);
            setResults(results);
          }
        })
        .catch(() => {
          if (!abort.signal.aborted) {
            setStatus(SearchStatus.Error);
          }
          console.error;
        });
    }, 300);

    return () => {
      abort.abort();
      clearTimeout(timeout);
      setStatus(SearchStatus.Init);
    };
  }, [query]);

  async function onTrackClick(track: Spotify.Track) {
    toast.promise(pushTrack(track.uri), {
      pending: `Adding "${track.name}"...`,
      success: `"${track.name}" added`,
      error: `Failed to add "${track.name}"`,
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
  }

  function statusDescription(): string {
    switch (status) {
      case SearchStatus.Init:
        return "Start searching to get started";
      case SearchStatus.Done:
        return "No result";
      case SearchStatus.Error:
        return "Search failed";
      case SearchStatus.Loading:
        return "Loading...";
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="search"
        className={styles.input}
        placeholder="Search song name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 ? (
        <>
          <table className={track_styles.table}>
            <thead>
              <TrackHeader onClick={() => undefined} />
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
      ) : (
        <p className={styles.status}>{statusDescription()}</p>
      )}
    </form>
  );
}
