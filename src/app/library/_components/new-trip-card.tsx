import { Button, Icons } from "~/components/ui";

export default function NewTripCard({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <li>
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="unset"
        size="unset"
        className="relative flex h-[20.25rem] w-[14.25rem] items-center justify-center gap-1 rounded-xl fill-gray-400 stroke-gray-300 font-medium text-gray-400 duration-200 ease-kolumb-flow bg-stripe-60-gray-500/10 hover:fill-gray-600 hover:stroke-gray-500 hover:text-gray-600 hover:bg-stripe-60-gray-500/15 disabled:opacity-50"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute -left-px -top-px h-full w-full overflow-visible fill-transparent"
        >
          <rect
            x="1"
            y="1"
            width="229px"
            height="325px"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="8 8"
            rx="12"
          />
        </svg>
        <Icons.plus aria-hidden="true" className="w-2.5" />
        New trip
      </Button>
    </li>
  );
}
