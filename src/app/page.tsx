import { getQueue } from "@/utils/queue";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import TrackCover from "./track";
import TrackList from "./track_list";
import Form from "./form";

export default async function Home() {
  const queue = await getQueue();
  if (queue === null) redirect("/login");

  return (
    <main className={styles.main}>
      <Form />

      {queue.currentlyPlaying !== null && (
        <>
          <h1>Currently playing</h1>
          <TrackCover track={queue.currentlyPlaying} />
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
