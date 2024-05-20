import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { useTripContext } from "./trip-context";
import { toastHandler } from "~/lib/trpc";

import SwitchTrip from "./switch-trip";
import { Input } from "~/components/ui";

export default function TripStack() {
  const { trip, setTrip, myMemberships } = useTripContext();

  const router = useRouter();
  const updateTrip = api.trip.update.useMutation(toastHandler("Trip name changed"));

  const handleUpdate = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    setTrip({ ...trip, name: e.target.value }, "Change trip name");
    updateTrip.mutate({ id: trip.id, name: e.target.value }, { onError: () => router.refresh() });
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={trip.name}
        onChange={(e) => setTrip({ ...trip, name: e.target.value })}
        onUpdate={handleUpdate}
        className={{
          container: "h-fit",
          input:
            "rounded bg-transparent px-0 py-0.5 font-normal shadow-none duration-300 ease-kolumb-flow hover:bg-black/5 hover:shadow-sm focus:bg-white focus:px-2 focus:shadow-focus",
          dynamic: "peer-hover:px-2 peer-focus:px-2",
        }}
        preventEmpty
        dynamicWidth
      />

      <SwitchTrip myMemberships={myMemberships} />
    </div>
  );
}
