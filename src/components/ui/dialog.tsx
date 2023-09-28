import { forwardRef } from "react";

const Dialog = {
  Root: forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Root(
    { className, children, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`shadow-border3xl absolute z-20 rounded-xl bg-white backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }),
};

export default Dialog;
