import { cn } from "~/lib/utils";

export default function Form(props: {
  onSubmit: () => Promise<void> | void;
  className?: string;
  children: React.ReactNode;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await props.onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full space-y-4", props?.className)}>
      {props.children}
    </form>
  );
}
