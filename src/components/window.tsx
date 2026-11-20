import { cn } from "~/lib/utils";

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
  const controls = [
    { label: "Close", onClick: props.onClose, color: "border-red-600 bg-red-500" },
    { label: "Minimize", onClick: props.onMinimize, color: "border-yellow-600 bg-yellow-500" },
    { label: "Maximize", onClick: props.onMaximize, color: "border-green-600 bg-green-500" },
  ];

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
          {controls.map((control) =>
            control.onClick ? (
              <button
                key={control.label}
                type="button"
                onClick={control.onClick}
                aria-label={`${control.label} ${props.title}`}
                className={cn(
                  "size-3 rounded-full border-[0.5px] hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600",
                  control.color,
                )}
              />
            ) : (
              <span
                key={control.label}
                aria-hidden="true"
                className={cn("size-3 rounded-full border-[0.5px]", control.color)}
              />
            ),
          )}
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
