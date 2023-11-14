/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

import Icon from "../icons";
import { useCloseTriggers } from "@/hooks/use-accessibility-features";

interface DropdownProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  className?: string;
  children: React.ReactNode;
}
export function DropdownOld({ isModalOpen, setIsModalOpen, className, children }: DropdownProps) {
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
      className={"modal flex-col rounded-xl bg-white shadow-2xl " + (isModalOpen ? "flex " : "hidden ") + className}
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
export function DropdownButton({ onClick, className, children }: DropdownButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        "group flex flex-none select-none items-center rounded-[3px] text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-kolumblue-100 focus:z-10 " +
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
        width={48}
        height={48}
        draggable={false}
        className="rounded-xl"
      />
      <div className="flex w-48 flex-none select-text flex-col justify-around text-center">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">{username}</span>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs">{email}</span>
      </div>
    </div>
  );
}

export function DropdownSeparator() {
  return <div className="my-2 border-b border-gray-200"></div>;
}

interface ListProps {
  showList: boolean;
  height: number;
  children: React.ReactNode;
}
interface SelectableOptionProps {
  isSelected: boolean;
  animationDelay?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}
export const Dropdown2 = {
  List: ({ showList, height, children }: ListProps) => (
    <div
      role="listbox"
      aria-label="Dropdown List"
      style={{ height: height + 12 }}
      className={`absolute left-1/2 mt-1 origin-top -translate-x-1/2 overflow-scroll rounded-lg bg-white p-1.5 shadow-border2XL ${
        showList
          ? "scale-y-100 opacity-100 duration-300 ease-kolumb-flow"
          : "pointer-events-none scale-y-50 opacity-0 duration-200 ease-kolumb-leave"
      }`}
    >
      {children}
    </div>
  ),
  SelectableOption: ({ isSelected, animationDelay, onClick, children }: SelectableOptionProps) => {
    const [opacity, setOpacity] = useState("opacity-0");
    setTimeout(() => {
      setOpacity("opacity-100");
    }, 300);

    return (
      <button
        role="option"
        aria-selected={isSelected}
        style={{ animationDelay: animationDelay }}
        onClick={onClick}
        className={`group flex w-full flex-shrink-0 animate-appear items-center justify-between gap-4 whitespace-nowrap rounded fill-gray-400 px-3 py-1 text-sm hover:z-10 hover:bg-gray-100 hover:fill-red-500 hover:shadow-select ${opacity} ${
          isSelected ? "font-medium text-gray-700" : " text-gray-600"
        }`}
      >
        {children}
      </button>
    );
  },
  Separator: () => <div className="my-2 border-b border-gray-200"></div>,
};

interface DropdownSelectProps {
  optionHeight: number;
  maxVisibleOptionsLength: number;
  selectList: { icon?: React.ReactNode; text: string; optionText: string }[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<number>;
  className?: string;
}
export function DropdownSelect({
  optionHeight,
  maxVisibleOptionsLength,
  selectList,
  selectedIndex,
  setSelectedIndex,
  className,
  ...props
}: DropdownSelectProps) {
  const [isDropdownShown, setDropdownShown] = useState(false);

  const visibleOptionsLength = selectList.length >= maxVisibleOptionsLength ? maxVisibleOptionsLength : selectList.length;
  const height = optionHeight * visibleOptionsLength;

  const ref = useRef<HTMLDivElement>(null);
  useCloseTriggers([ref], () => setDropdownShown(false));

  return (
    <div ref={ref} className={`absolute ${className}`}>
      <label
        onClick={() => setDropdownShown(!isDropdownShown)}
        className="flex h-full w-full cursor-pointer select-none items-center justify-between gap-1 fill-gray-600 pl-1 pr-2 text-center text-sm text-gray-600"
        {...props}
      >
        <p className="">{selectList[selectedIndex].text}</p>
        <Icon.chevron className={`h-full w-2.5 flex-shrink-0 duration-150 ease-in-out ${isDropdownShown && "rotate-180"}`} />
      </label>

      <Dropdown2.List showList={isDropdownShown} height={height}>
        {selectList.map((option, index) => (
          <Dropdown2.SelectableOption
            key={index}
            isSelected={index === selectedIndex}
            onClick={() => {
              setSelectedIndex(index);
              setDropdownShown(false);
            }}
          >
            <div className="flex flex-shrink-0 gap-3">
              {option?.icon}
              {option?.optionText}
            </div>

            <Icon.check className={`h-2 flex-shrink-0 ${index === selectedIndex ? "fill-gray-700" : "fill-transparent"}`} />
          </Dropdown2.SelectableOption>
        ))}
      </Dropdown2.List>
    </div>
  );
}
