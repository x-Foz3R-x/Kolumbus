import { cn } from "~/lib/utils";
import { memo, useMemo } from "react";

type ClassName = {
  progress?: string;
  progressBar?: string;
  progressValue?: string;
  label?: string;
};

type LabelType = { type: "value" | "max" | "value/max" | "%" };
type OutsideLabelType = { left?: string | LabelType; right?: string | LabelType } | string;

type Comparison = "<" | ">" | "==" | "<=" | ">=";
type LevelType = { level: number; is: Comparison; className?: ClassName };

type ProgressProps = {
  outsideLabel?: OutsideLabelType;
  insideLabel?: string | LabelType;
  value?: number;
  max?: number;
  levels?: LevelType[];
  className?: ClassName;
};
export const Progress = memo(function Progress({
  outsideLabel,
  insideLabel,
  value = 0,
  max = 1,
  levels,
  className,
}: ProgressProps) {
  const percentage = useMemo(() => Math.round((value / max) * 100), [value, max]);

  const levelClassName = useMemo(() => {
    if (!levels) return;
    const level = levels
      .slice()
      .reverse()
      .find((l) => {
        switch (l.is) {
          case "<":
            return percentage < l.level;
          case ">":
            return percentage > l.level;
          case "==":
            return percentage == l.level;
          case "<=":
            return percentage <= l.level;
          case ">=":
            return percentage >= l.level;
          default:
            return false;
        }
      });
    return level?.className;
  }, [percentage, levels]);

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 text-xs font-medium leading-none tracking-tight",
        className?.progress,
        levelClassName?.progress,
      )}
    >
      <OutsideLabel
        label={outsideLabel}
        percentage={percentage}
        value={value}
        max={max}
        className={cn(className?.label, levelClassName?.label)}
      />

      <div
        className={cn(
          "relative h-fit w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
          className?.progressBar,
          levelClassName?.progressBar,
        )}
      >
        <div
          className={cn(
            "h-full min-h-2.5 rounded-full bg-kolumblue-500 p-0.5 text-white",
            className?.progressValue,
            levelClassName?.progressValue,
          )}
          style={{ width: `${percentage}%` }}
        >
          <p className={cn("text-center", className?.label, levelClassName?.label)}>
            {generateLabelContent(insideLabel, percentage, value, max)}
          </p>
        </div>
      </div>
    </div>
  );
});

type OutsideLabelProps = {
  label?: OutsideLabelType;
  percentage: number;
  value: number;
  max: number;
  className?: string;
};
const OutsideLabel = memo(function OutsideLabel({
  label,
  percentage,
  value,
  max,
  className,
}: OutsideLabelProps) {
  if (typeof label === "undefined") return null;

  if (typeof label === "string")
    return <p className={cn("w-full text-center", className)}>{label}</p>;

  const left = generateLabelContent(label.left, percentage, value, max);
  const right = generateLabelContent(label.right, percentage, value, max);

  return (
    <div className={cn("flex w-full justify-between px-0.5 text-center", className)}>
      <p>{left}</p>
      <p>{right}</p>
    </div>
  );
});

function generateLabelContent(
  label: string | LabelType | undefined,
  percentage: number,
  value: number,
  max: number,
) {
  if (typeof label === "string") return label;
  if (typeof label === "undefined") return undefined;

  if (label.type === "value") return value.toString();
  if (label.type === "max") return max.toString();
  if (label.type === "value/max") return `${value}/${max}`;
  if (label.type === "%") return `${percentage}%`;
}
