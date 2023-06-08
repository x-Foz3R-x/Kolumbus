interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Main({ children, className = "" }: Props) {
  return (
    <main
      style={
        {
          // backgroundImage: `url("https://png.pngtree.com/background/20230414/original/pngtree-sea-%E2%80%8B%E2%80%8Bsunrise-scenery-blue-sky-clouds-beautiful-sky-background-picture-image_2424890.jpg")`,
        }
      }
      className={
        "relative h-[calc(100vh-3.5rem)] w-[calc(100vw-14rem)] overflow-y-scroll rounded-tl-lg bg-kolumblue-50 bg-gradient-to-r from-kolumblue-50 to-kolumblue-100 bg-cover bg-center bg-no-repeat px-4 pb-0 shadow-kolumblueInset" +
        className
      }
    >
      {children}
    </main>
  );
}
