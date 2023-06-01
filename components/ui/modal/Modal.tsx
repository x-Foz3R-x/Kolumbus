import React, { useLayoutEffect, useRef } from "react";

import "./Modal.css";

interface Props {
  children: React.ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: any;
  className?: string;
}

export default function Modal({
  children,
  isModalOpen,
  setIsModalOpen,
  className,
}: Props) {
  const modalRef: any = useRef(null);

  useLayoutEffect(() => {
    if (isModalOpen) {
      document.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleClick = (e: any) => {
    const modalDimensions = modalRef.current?.getBoundingClientRect();
    if (
      e.clientX < modalDimensions.left ||
      e.clientX > modalDimensions.right ||
      e.clientY < modalDimensions.top ||
      e.clientY > modalDimensions.bottom
    )
      setIsModalOpen(false);
  };

  const handleKeyDown = (e: any) => {
    const ESCAPE_KEY = 27;
    if (e.keyCode == ESCAPE_KEY) setIsModalOpen(false);
  };

  return (
    <div
      ref={modalRef}
      aria-haspopup={true}
      aria-hidden={isModalOpen}
      className={
        "modal flex-col rounded-xl bg-white shadow-default " +
        (isModalOpen ? "flex " : "hidden ") +
        className
      }
    >
      {children}
    </div>
  );
}
