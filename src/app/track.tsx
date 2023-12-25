import * as Spotify from "spotify-api.js";
import { DispatchWithoutAction } from "react";
import styles from "./track.module.css";

interface Props {
  track: Spotify.Track;
  onClick?: DispatchWithoutAction;
}

export default function TrackCover({ track, onClick }: Props) {
  return (
    <div className={styles.container} role={"gridcell"} onClick={onClick}>
      <div className={styles.index}>{"▸"}</div>
      <img
        alt="album cover"
        className={styles.cover}
        draggable={false}
        src={track.album?.images[0].url}
      ></img>
      <div>
        <div className={styles.title}>{track.name}</div>
        <div className={styles.artist}>
          {track.artists.map((artist) => artist.name).join(", ")}
        </div>
      </div>
    </div>
  );
}
