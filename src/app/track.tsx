import * as Spotify from "spotify-api.js";
import styles from "./track.module.css";

interface Props {
  track: Spotify.Track;
}

export default function TrackCover({ track }: Props) {
  return (
    <div className={styles.container} role={"gridcell"}>
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
