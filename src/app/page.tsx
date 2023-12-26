import { getQueue, getPlaybackState } from "@/utils/queue";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import TrackCover from "./track_cover";
import TrackList from "./track_list";
import Form from "./form";

export default async function Home() {
  const queue = await getQueue();
  const playback = await getPlaybackState();
  if (queue === null) redirect("/login");

  return (
    <main className={styles.main}>
      <Form />

      {playback !== null && playback.currentlyPlaying !== null && (
        <>
          <h1>Currently playing</h1>
          <TrackCover
            track={playback.currentlyPlaying}
            progress={playback.progress}
          />
        </>
      )}

      {queue.queue.length > 0 && (
        <>
          <h1>Queue</h1>
          <TrackList items={queue.queue}></TrackList>
        </>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
