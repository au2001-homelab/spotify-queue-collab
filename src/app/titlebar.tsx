"use client";

import { useState } from "react";
import Image from "next/image";
import * as Spotify from "spotify-api.js";
import styles from "./titlebar.module.css";
import Search from "./search";
import Modal from "./modal";

interface Props {
  active: boolean;
}

export default function TitleBar({ active }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const showSongModel = () => {
    setIsOpen(true);
  };
  const hideSongModel = () => {
    setIsOpen(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <header className={styles.header}>
        <div>
          <div style={{ width: "25px" }}>
            <Image
              alt="icon"
              className={styles.icon}
              src="/favicon.ico"
              width={50}
              height={50}
            ></Image>
          </div>
          <div style={{ width: "100%" }}>
            <h2 className={styles.title}>Spotify collab</h2>
          </div>
          <div style={{ width: "100px" }}>
            <button onClick={showSongModel} disabled={!active}>
              + Add a song
            </button>
          </div>
        </div>
      </header>
      <Modal title="Add a song" isOpen={isOpen} handleClose={hideSongModel}>
        <Search />
      </Modal>
    </div>
  );
}
