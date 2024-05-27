import { SpinnerCopy } from "@/components/ui";

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SpinnerCopy.resize size="xl" />
    </div>
  );
}
