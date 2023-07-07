import { useLayoutEffect, useRef } from "react";
import Image from "next/image";

import "./dropdown.css";

interface DropdownProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  className?: string;
  children: React.ReactNode;
}

export function Dropdown({
  isModalOpen,
  setIsModalOpen,
  className,
  children,
}: DropdownProps) {
  const modalRef: any = useRef(null);

  useLayoutEffect(() => {
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

    if (isModalOpen) {
      document.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

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

interface DropdownButtonProps {
  onClick?: any;
  className?: string;
  children: React.ReactNode;
}

export function DropdownButton({
  onClick,
  className,
  children,
}: DropdownButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        "group flex flex-none select-none items-center rounded-[3px] first:rounded-t-lg last:rounded-b-lg hover:bg-kolumblue-100 focus:z-10 " +
        className
      }
    >
      {children}
    </button>
  );
}

interface DropdownProfileProps {
  username: string;
  email: string;
}

export function DropdownProfile({ username, email }: DropdownProfileProps) {
  return (
    <div className="flex w-full select-none flex-col items-center gap-1 p-3 pb-1">
      <Image
        src="/images/default-avatar.png"
        alt="default avatar picture"
        width={64}
        height={64}
        draggable={false}
        className="rounded-xl"
      />
      <div className="flex w-48 flex-none select-text flex-col justify-around text-center">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {username}
        </span>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {email}
        </span>
      </div>
    </div>
  );
}

export function DropdownSeparator() {
  return <div className="my-2 border-b border-kolumbGray-200"></div>;
}
