import { getSpotifyAccessToken } from "@/utils/redis";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

async function getState() {
  const accessToken = await getSpotifyAccessToken();
  return { accessToken };
}

export default async function Home() {
  const { accessToken } = await getState();
  if (accessToken === null) redirect("/login");

  return <main className={styles.main}>Lorem ipsum</main>;
}
