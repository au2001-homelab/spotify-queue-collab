"use client";

import {
  useRef,
  useEffect,
  DispatchWithoutAction,
  ReactNode,
  MouseEvent,
} from "react";
import { ToastContainer } from "react-toastify";
import styles from "./modal.module.css";

interface Props {
  title: string | undefined;
  children: ReactNode;
  isOpen: boolean;
  handleClose: DispatchWithoutAction;
}

export default function Modal({ title, children, isOpen, handleClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = () => {
    dialogRef.current?.close();
  };

  function handleClickOutside(event: MouseEvent) {
    if (!dialogRef.current) return;

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
      <div className={styles.container}>
        <div className={styles.header}>
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
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </dialog>
  );
}
