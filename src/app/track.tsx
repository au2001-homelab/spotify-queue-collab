import { DispatchWithoutAction } from "react";
import * as Spotify from "spotify-api.js";

interface Props {
  track: Spotify.Track;
  onClick?: DispatchWithoutAction;
}

export default function Track({ track, onClick }: Props) {
  return (
    <div onClick={onClick}>
      {track.name} by {track.artists.map((artist) => artist.name).join(", ")}
    </div>
  );
}
