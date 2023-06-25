"use client";

import { useUserData } from "@/context/user-data";

export default function useSelectedTrip() {
  const { selectedTrip, setSelectedTrip } = useUserData();

  return [selectedTrip, setSelectedTrip];
}
