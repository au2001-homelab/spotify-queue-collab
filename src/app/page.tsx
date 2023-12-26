import { getQueue, getCurrentPlayback } from "@/utils/queue";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import TrackCover from "./track_cover";
import TrackList from "./track_list";
import Form from "./form";

export default async function Home() {
  const [queue, currentPlayback] = await Promise.all([
    getQueue(),
    getCurrentPlayback(),
  ]);
  if (queue === null) redirect("/login");

  return (
    <main className={styles.main}>
      <Form />

      {currentPlayback?.isPlaying && currentPlayback.item?.type === "track" && (
        <>
          <h1>Currently playing</h1>
          <TrackCover currentPlayback={currentPlayback} />
        </>
      )}

      {queue.length > 0 && (
        <>
          <h1>Queue</h1>
          <TrackList items={queue}></TrackList>
        </>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
