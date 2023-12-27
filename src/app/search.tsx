"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as Spotify from "spotify-api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pushTrack, searchTracks } from "./actions";
import { TrackHeader, TrackItem } from "./track_list";
import styles from "./search.module.css";
import track_styles from "./track_list.module.css";

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Spotify.Track[]>([]);

  useEffect(() => {
    if (query === "") {
      setResults([]);
      return;
    }

    const abort = new AbortController();

    const timeout = setTimeout(() => {
      searchTracks(query)
        .then((results) => {
          if (!abort.signal.aborted) setResults(results);
        })
        .catch(console.error);
    }, 100);

    return () => {
      abort.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  async function onTrackClick(track: Spotify.Track) {
    const success = await pushTrack(track.uri);
    if (success) {
      toast.success("Song added");
      router.refresh();
    } else {
      toast.error("Failed to add song");
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
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
      {results.length > 0 && (
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
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </form>
  );
}
