interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function Main({ className, children }: Props) {
  return (
    <main
      style={
        {
          // backgroundImage: `url("https://png.pngtree.com/background/20230414/original/pngtree-sea-%E2%80%8B%E2%80%8Bsunrise-scenery-blue-sky-clouds-beautiful-sky-background-picture-image_2424890.jpg")`,
        }
      }
      className={`relative h-[calc(100vh-3.5rem)] w-[calc(100vw-14rem)] overflow-x-hidden overflow-y-scroll rounded-tl-lg border-l border-t border-gray-100 bg-cover bg-center bg-no-repeat ${className}`}
    >
      {children}
    </main>
  );
}
