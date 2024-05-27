import { Button, SpinnerCopy } from "@/components/ui";

export default function SubmitButton(props: { loading: boolean; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Button
      type="submit"
      disabled={props.loading || props.disabled}
      variant="appear"
      className="flex h-10 w-full items-center justify-center bg-gray-800 font-medium text-white shadow-sm hover:bg-gray-700 focus-visible:shadow-focus disabled:opacity-85"
    >
      {props.loading ? <SpinnerCopy.default className="fill-white" /> : props.children}
    </Button>
  );
}
