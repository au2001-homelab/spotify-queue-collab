import styles from "./page.module.css";
import { redirect } from "next/navigation";
import { exchangeAccessToken } from "@/utils/auth";
import { REDIRECT_URL } from "@/utils/constants";

function getLoginURL() {
  const params = new URLSearchParams();
  params.set("response_type", "code");
  params.set("client_id", process.env.SPOTIFY_CLIENT_ID ?? "");
  params.set(
    "scope",
    "user-read-currently-playing user-read-playback-state user-modify-playback-state",
  );
  params.set("redirect_uri", REDIRECT_URL);

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

interface Props {
  searchParams: {
    code?: string;
  };
}

export default async function Login({ searchParams: { code } }: Props) {
  let error: string | undefined;

  if (code !== undefined) {
    try {
      await exchangeAccessToken(code);
    } catch (e: any) {
      console.error(e);
      error = e.message ?? e.error_description ?? e.error ?? e.toString();
    }

    if (error === undefined) redirect("/");
  }

  const url = getLoginURL();

  return (
    <main className={styles.main}>
      {error !== undefined && <p className={styles.error}>{error}</p>}
      <a href={url} className={styles.button}>
        Login with Spotify
      </a>
    </main>
  );
}
