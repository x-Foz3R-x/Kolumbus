// import api from "@/app/_trpc/client";
// import useAppdata from "@/context/appdata";
// import { useUser } from "@clerk/nextjs";

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
      </div>
    </main>
  );
}
