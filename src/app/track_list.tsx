import { DispatchWithoutAction } from "react";
import * as Spotify from "spotify-api.js";
import styles from "./track_list.module.css";

interface ItemProps {
  index: number;
  track: Spotify.Track;
  onClick?: DispatchWithoutAction;
}

const formatDuration = (milliseconds: number) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
  const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

export function TrackHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.row} role={"gridcell"}>
        <div>{"#"}</div>
        <div>Titre</div>
        <div></div>
        <div>Album</div>
        <div>Durée</div>
      </div>
      <hr />
    </div>
  );
}

export function TrackItem({ index, track, onClick }: ItemProps) {
  return (
    <div
      onClick={onClick}
      className={[
        styles.row,
        onClick == undefined ? styles.queue_track : styles.track,
      ].join(" ")}
      role={"gridcell"}
    >
      <div className={styles.index}>{`${index + 1}.`}</div>
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
      <div className={styles.album}>{track.album?.name}</div>
      <div className={styles.duration}>{formatDuration(track.duration)}</div>
    </div>
  );
}

interface ListProps {
  items: Spotify.Track[];
}

export default function TrackList({ items }: ListProps) {
  return (
    <div>
      <TrackHeader />
      {items.map((track, index) => (
        <TrackItem index={index} key={track.id} track={track} />
      ))}
    </div>
  );
}
