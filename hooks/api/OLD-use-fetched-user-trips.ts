/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";

import { useAuth } from "@/context/auth";
import { useUserTrips } from "@/context/user-trips";

import { db } from "@/lib/firebase";

export default function useFetchUserTrips() {
  const { currentUser } = useAuth();
  const { userTrips, dispatch, ACTION } = useUserTrips();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<Array<any>>([]);
  const [newlyFetched, setNewlyFetched] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (currentUser != null) {
          const colRef = collection(db, "trips");
          const q = query(
            colRef,
            where("owner_id", "==", currentUser.uid),
            orderBy("position")
          );

          const docSnap = await getDocs(q);
          if (docSnap.empty) return;

          docSnap.docs.forEach((trip) => {
            setPayload((trips) => [...trips, trip.data()]);
          });
        } else {
          const docSnap = JSON.parse(localStorage.getItem("trips") || "");
          setPayload(docSnap);
        }

        setNewlyFetched(true);
      } catch (error) {
        setError("failed to fetch user trips");
        console.log(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (payload.length != 0 && newlyFetched) {
      dispatch({ type: ACTION.REPLACE, payload: payload });
      setNewlyFetched(false);
    }

    if (userTrips.length != 0) {
      setLoading(false);
    }
  }, [payload, userTrips]);

  return [loading, error, userTrips, dispatch, ACTION];
}
