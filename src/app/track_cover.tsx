import Image from "next/image";
import * as Spotify from "spotify-api.js";
import { formatDuration } from "@/utils/ui";
import styles from "./track_cover.module.css";

interface Props {
  currentPlayback: Spotify.CurrentPlayback;
}

export default function TrackCover({ currentPlayback }: Props) {
  const track = currentPlayback.item as Spotify.Track;

  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <td className={styles.index}>{"▸"}</td>
          <td className={styles.cover_column}>
            <Image
              alt="album cover"
              className={styles.cover}
              draggable={false}
              src={track.album?.images[0].url ?? ""}
              width={200}
              height={200}
            />
          </td>
          <td className={styles.absorbing_column}>
            <div className={styles.title}>{track.name}</div>
            <div className={styles.artist}>
              {track.artists.map((artist) => artist.name).join(", ")}
            </div>
          </td>
          <td>
            <div className={styles.duration}>
              {formatDuration(currentPlayback.progress)} /{" "}
              {formatDuration(track.duration)}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
