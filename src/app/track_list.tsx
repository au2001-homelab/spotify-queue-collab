import Image from "next/image";
import { DispatchWithoutAction } from "react";
import * as Spotify from "spotify-api.js";
import { formatDuration } from "@/utils/ui";
import styles from "./track_list.module.css";

interface HeaderProps {
  onClick?: DispatchWithoutAction;
}

interface ItemProps {
  index: number;
  track: Spotify.Track;
  onClick?: DispatchWithoutAction;
}

export function TrackHeader({ onClick }: HeaderProps) {
  return (
    <tr className={styles.header}>
      {onClick === undefined && <th className={styles.index}>#</th>}
      <th className={styles.cover_column}>Title</th>
      <th></th>
      <th className={styles.album}>Album</th>
      <th className={styles.duration}>🕗</th>
    </tr>
  );
}

export function TrackItem({ index, track, onClick }: ItemProps) {
  return (
    <tr
      onClick={onClick}
      className={`${styles.row} ${
        onClick == undefined ? styles.queue_track : styles.track
      }`}
      role="gridcell"
    >
      {onClick === undefined && <td className={styles.index}>{index}.</td>}
      <td>
        <Image
          alt="album cover"
          className={styles.cover}
          draggable={false}
          src={track.album?.images[0].url ?? ""}
          width={200}
          height={200}
        />
      </td>
      <td>
        <div className={styles.title}>{track.name}</div>
        <div className={styles.artist}>
          {track.artists.map((artist) => artist.name).join(", ")}
        </div>
      </td>
      <td className={styles.album}>{track.album?.name ?? "-"}</td>
      <td className={styles.duration}>{formatDuration(track.duration)}</td>
    </tr>
  );
}

interface ListProps {
  items: Spotify.Track[];
  onClick?: DispatchWithoutAction;
}

export default function TrackList({ items, onClick }: ListProps) {
  return (
    <table className={styles.table}>
      <thead>
        <TrackHeader onClick={onClick} />
      </thead>
      <tbody>
        {items.map((track, index) => (
          <TrackItem
            index={index + 2}
            key={track.id}
            track={track}
            onClick={onClick}
          />
        ))}
      </tbody>
    </table>
  );
}
