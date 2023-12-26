import { getQueue, getCurrentPlayback } from "@/utils/queue";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import TitleBar from "./titlebar";
import TrackCover from "./track_cover";
import TrackList from "./track_list";

interface Props {
  queue: any;
  currentPlayback: any;
}

export function Body({ queue, currentPlayback }: Props) {
  return (
    <div className={styles.body}>
      <h1>Currently playing</h1>
      {(() => {
        if (
          currentPlayback?.isPlaying &&
          currentPlayback.item?.type === "track"
        ) {
          return <TrackCover currentPlayback={currentPlayback} />;
        } else {
          return <div>Play any song on Spotify to get started!</div>;
        }
      })()}
      <br />
      <h1>Queue</h1>
      {(() => {
        if (queue !== null && queue.length > 0) {
          return <TrackList items={queue}></TrackList>;
        } else {
          return <div>Your song queue is empty.</div>;
        }
      })()}
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
      <TitleBar />
      <Body queue={queue} currentPlayback={currentPlayback} />
    </main>
  );
}

export const dynamic = "force-dynamic";
