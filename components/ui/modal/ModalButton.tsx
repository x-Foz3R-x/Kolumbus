interface Props {
  children: React.ReactNode;
  onClick?: any;
  className?: string;
}

export default function ModalButton({ children, onClick, className }: Props) {
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
