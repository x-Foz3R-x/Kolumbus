import { cn } from "~/lib/utils";
import { Button } from "../ui";

export default function Window(props: {
  title: string;
  state: { isOpen: boolean; isMinimized: boolean };
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  children: React.ReactNode;
}) {
  if (!props.state.isOpen) return null;

  return (
    <div
      className={cn(
        "w-fit overflow-hidden rounded-[10px] shadow-borderSplashXl duration-500 ease-kolumb-flow",
        props.state.isMinimized && "scale-0",
      )}
    >
      {/* Frame */}
      <div className="relative flex h-10 rounded-t-[10px] bg-stone-200/90 backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
        {/* Controls */}
        <div className="flex h-full items-center gap-2 px-5">
          <Button
            onClick={props.onClose}
            variant="unset"
            size="unset"
            className="h-3 w-3 rounded-full border-[0.5px] border-red-600 bg-red-500"
          />
          <Button
            onClick={props.onMinimize}
            variant="unset"
            size="unset"
            className="h-3 w-3 rounded-full border-[0.5px] border-yellow-600 bg-yellow-500"
          />
          <Button
            onClick={props.onMaximize}
            variant="unset"
            size="unset"
            className="h-3 w-3 rounded-full border-[0.5px] border-green-600 bg-green-500"
          />
        </div>

        {/* Title */}
        <div className="flex h-full w-full items-center justify-center px-5 text-[15px] font-semibold mix-blend-color-burn">
          {props.title}
        </div>

        <span className="w-[92px] flex-shrink-0" />
      </div>

      {/* Body */}
      <div className="w-fit min-w-full bg-white p-2.5">{props.children}</div>
    </div>
  );
}
