import { Button, Spinner } from "~/components/ui";

export default function SubmitButton(props: {
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="submit"
      onClick={props.onSubmit}
      disabled={props.loading}
      variant="appear"
      size="lg"
      className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-800 font-medium text-white shadow-sm hover:bg-gray-700"
    >
      {props.loading ? <Spinner.default className="fill-white" /> : props.children}
    </Button>
  );
}
