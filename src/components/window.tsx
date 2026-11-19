import { cn } from "~/lib/utils";
import { Button, Icons } from "./ui";

export default function Window(props: {
  id?: string;
  title: string;
  isOpen: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  style?: React.CSSProperties;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  if (!props.isOpen) return null;

  return (
    <div
      className={cn(
        "flex h-fit w-fit max-w-full flex-col overflow-hidden rounded-[10px] shadow-borderSplashXl duration-500",
        props.containerClassName,
      )}
    >
      {/* Frame */}
      <div className="relative flex h-10 rounded-t-[10px] bg-stone-200/90 backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
        {/* Controls */}
        <div className="flex h-full items-center gap-2 px-5">
          <Button
            onClick={props.onClose}
            aria-label={`Close ${props.title}`}
            disabled={!props.onClose}
            variant="unset"
            size="unset"
            className="flex h-3 w-3 items-center justify-center rounded-full border-[0.5px] border-red-600 bg-red-500"
          >
            {props.onClose && <Icons.x aria-hidden="true" className="size-1.5 fill-red-950" />}
          </Button>
          <Button
            onClick={props.onMinimize}
            aria-label={`Minimize ${props.title}`}
            disabled={!props.onMinimize}
            variant="unset"
            size="unset"
            className="h-3 w-3 rounded-full border-[0.5px] border-yellow-600 bg-yellow-500"
          />
          <Button
            onClick={props.onMaximize}
            aria-label={`Maximize ${props.title}`}
            disabled={!props.onMaximize}
            variant="unset"
            size="unset"
            className="h-3 w-3 rounded-full border-[0.5px] border-green-600 bg-green-500"
          />
        </div>

        {/* Title */}
        <div className="flex h-full min-w-0 flex-1 items-center justify-center overflow-hidden whitespace-nowrap px-2 text-[15px] font-semibold mix-blend-color-burn">
          {props.title}
        </div>

        <span className="w-[92px] flex-shrink-0" />
      </div>

      {/* Body */}
      <div
        id={props.id}
        style={props.style}
        className={cn(
          "w-fit min-w-full overflow-visible bg-white p-2.5 duration-500 ease-kolumb-flow",
          props.className,
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
