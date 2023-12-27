"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./titlebar.module.css";
import Search from "./search";
import Modal from "./modal";
import { useRouter } from "next/navigation";

interface Props {
  active: boolean;
}

export default function TitleBar({ active }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 10 * 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      <header className={styles.header}>
        <Image
          alt="icon"
          className={styles.icon}
          src="/favicon.ico"
          width={25}
          height={25}
        />
        <h2 className={styles.title}>Spotify collab</h2>
        <button
          className={styles.button}
          onClick={() => setIsOpen(true)}
          disabled={!active}
        >
          + Add a song
        </button>
      </header>
      <Modal
        title="Add a song"
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      >
        <Search />
      </Modal>
    </>
  );
}
