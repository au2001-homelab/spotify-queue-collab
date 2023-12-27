import { getQueue, getCurrentPlayback } from "@/utils/queue";
import * as Spotify from "spotify-api.js";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import TitleBar from "./titlebar";
import TrackCover from "./track_cover";
import TrackList from "./track_list";

interface Props {
  queue: Spotify.Track[];
  currentPlayback: Spotify.CurrentPlayback | null;
}

function Body({ queue, currentPlayback }: Props) {
  return (
    <div className={styles.body}>
      <h1>Currently playing</h1>
      {currentPlayback?.item?.type === "track" ? (
        <TrackCover currentPlayback={currentPlayback} />
      ) : (
        <div>Play any song on Spotify to get started!</div>
      )}
      <br />
      <h1>Queue</h1>
      {queue.length > 0 ? (
        <TrackList items={queue}></TrackList>
      ) : (
        <div>The song queue is empty.</div>
      )}
      {queue.length >= 20 && (
        <p className={styles.footnote}>
          Only the first 20 elements of the queue are shown.
        </p>
      )}
    </div>
  );
}

export default async function Home() {
  const [queue, currentPlayback] = await Promise.all([
    getQueue(),
    getCurrentPlayback(),
  ]);
  if (queue === null) redirect("/login");

  return (
    <main className={styles.main}>
      <TitleBar active={currentPlayback !== null} />
      <Body queue={queue} currentPlayback={currentPlayback} />
    </main>
  );
}

export const dynamic = "force-dynamic";
