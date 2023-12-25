"use server";

import { getQueue } from "@/utils/queue";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import Track from "./track";
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
          <Track track={queue.currentlyPlaying} />
        </>
      )}

      {queue.queue.length > 0 && (
        <>
          <h1>Queue</h1>
          {queue.queue.map((track) => (
            <Track key={track.id} track={track} />
          ))}
        </>
      )}
    </main>
  );
}
