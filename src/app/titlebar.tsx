"use client";
import {
  useRef,
  useEffect,
  useState,
  DispatchWithoutAction,
  ReactNode,
  MouseEvent,
} from "react";
import Image from "next/image";
import styles from "./titlebar.module.css";
import Search from "./search";

interface Props {
  title: string | undefined;
  children: ReactNode;
  isOpen: boolean;
  handleClose: DispatchWithoutAction;
}

function Modal({ title, children, isOpen, handleClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = () => {
    dialogRef.current?.close();
  };

  function handleClickOutside(event: MouseEvent) {
    if (!dialogRef.current) {
      return;
    }

    const box = dialogRef.current?.getBoundingClientRect();
    if (
      event.pageX < box.left ||
      event.pageX > box.right ||
      event.pageY < box.top + window.scrollY ||
      event.pageY > box.bottom + window.scrollY
    ) {
      close();
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialogRef.current?.open) {
      dialog?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog?.close();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <dialog
      className={styles.modal}
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleClickOutside}
    >
      <div className={styles.modal_header}>
        <div style={{ width: "100%" }}>
          <h1>{title}</h1>
        </div>
        <div style={{ width: "25px" }}>
          <button type="button" onClick={close} title="close">
            ╳
          </button>
        </div>
      </div>
      {children}
    </dialog>
  );
}

export default function TitleBar() {
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
            <button onClick={showSongModel}>+ Add a song</button>
          </div>
        </div>
      </header>
      <Modal title="Add a song" isOpen={isOpen} handleClose={hideSongModel}>
        <Search />
      </Modal>
    </div>
  );
}
