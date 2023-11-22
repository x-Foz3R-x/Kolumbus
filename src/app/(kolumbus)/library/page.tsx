"use client";

// import cuid2 from "@paralleldrive/cuid2";

// import api from "@/app/_trpc/client";
// import useAppdata from "@/context/appdata";
// import { useUser } from "@clerk/nextjs";

// import { tripTemplate } from "@/data/template-data";
// import { Trip, UT } from "@/types";

// import Icon from "@/components/icons";
// import A from "@/components/ui/a";
import YourTrips from "@/components/layouts/sidebar-menu/your-trips";

export default function Library() {
  // const { user } = useUser();
  // const createTrip = api.trip.create.useMutation();
  // const { userTrips, dispatchUserTrips } = useAppdata();

  return (
    <main className="mt-14 h-screen overflow-y-scroll bg-gray-50 bg-cover bg-center bg-no-repeat">
      <div className="mx-auto flex h-full max-w-5xl flex-col items-center gap-4 bg-white shadow-borderXL">
        <div className="text-center font-adso text-3xl font-bold text-gray-600">Library</div>
        <span className="w-80">
          <YourTrips />
        </span>
        {/* <section className="grid w-full flex-col items-center justify-items-center gap-2 px-4">
          {userTrips?.map((trip) => (
            <A key={trip.id} href={`/t/${trip.id}`} variant="tile" size="unstyled">
              <div className="flex h-full w-full flex-col items-center rounded-lg p-2 duration-200 ease-kolumb-overflow hover:scale-110">
                <Icon.itinerary className="mb-[3px] mt-[9px] h-6 w-6 flex-none" />
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center text-sm font-medium leading-[0.875rem]">{trip.name}</div>
                </div>
              </div>
            </A>
          ))}
        </section> */}
      </div>
    </main>
  );
}
