import { useState } from "react";

import { Input } from "~/components/ui";
import SwitchTrip from "./switch-trip";
import type { TripContext } from "~/lib/validations/trip";
import { api } from "~/trpc/react";
import { toastHandler } from "~/lib/trpc";

export default function TripStack(props: {
  tripId: string;
  tripName: string;
  myMemberships: TripContext["myMemberships"];
}) {
  const updateTrip = api.trip.update.useMutation(toastHandler("Trip name updated"));

  const [tripName, setTripName] = useState(props.tripName);

  return (
    <div className="flex items-center gap-2">
      <Input
        value={tripName}
        onChange={(e) => setTripName(e.target.value)}
        onUpdate={() => updateTrip.mutate({ id: props.tripId, name: tripName })}
        className={{
          container: "h-fit",
          input:
            "rounded bg-transparent px-0 py-0.5 font-normal shadow-none duration-300 ease-kolumb-flow hover:bg-black/5 hover:shadow-sm focus:bg-white focus:px-2 focus:shadow-focus",
          dynamic: "peer-hover:px-2 peer-focus:px-2",
        }}
        preventEmpty
        dynamicWidth
      />

      <SwitchTrip myMemberships={props.myMemberships} />
    </div>
  );
}
