type Props = {
  size?: number;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  className?: string;
};

const defaultAttributes: React.SVGAttributes<SVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export default function X({
  size = 24,
  strokeWidth = 2,
  absoluteStrokeWidth = true,
  className,
}: Props) {
  return (
    <svg
      {...defaultAttributes}
      width={size}
      height={size}
      strokeWidth={absoluteStrokeWidth ? (strokeWidth * 24) / Number(size) : strokeWidth}
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
