import { cn } from "~/lib/utils";

/**
 * Renders a color block component.
 *
 * @example
 * ```tsx
 * <ColorBlock className="rotate-3 bg-kolumblue-400 text-white selection:bg-kolumblue-100
 *   selection:text-kolumblue-600 hover:-rotate-6">
 *   Text
 * </ColorBlock>
 * ```
 */
export default function ColorBlock(props: { className?: string; children?: React.ReactNode }) {
  return (
    <span
      className={cn("mx-2 inline-block rounded p-2 duration-150 ease-kolumb-flow", props.className)}
    >
      {props.children}
    </span>
  );
}
