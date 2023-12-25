import Image from "next/image";
import * as Spotify from "spotify-api.js";
import { DispatchWithoutAction } from "react";
import styles from "./track.module.css";

interface Props {
  track: Spotify.Track;
  onClick?: DispatchWithoutAction;
}

export default function TrackCover({ track, onClick }: Props) {
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
            ></Image>
          </td>
          <td className={styles.absorbing_column}>
            <div className={styles.title}>{track.name}</div>
            <div className={styles.artist}>
              {track.artists.map((artist) => artist.name).join(", ")}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
