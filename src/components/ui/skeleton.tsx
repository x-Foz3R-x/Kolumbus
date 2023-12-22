import { cn } from "@/lib/utils";

export default function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement> & { className?: string }) {
  return <div role="presentation" className={cn("animate-pulse bg-gray-100", className)} {...props} />;
}
