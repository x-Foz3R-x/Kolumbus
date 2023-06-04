/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";

import { useAuth } from "@/context/auth";
import { useUserTrips } from "@/context/user-trips";

import { db } from "@/lib/firebase";

export default function useFetchUserTrips() {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<Array<any>>([]);
  const [newlyFetched, setNewlyFetched] = useState(false);

  const { userTrips, dispatch, ACTIONS } = useUserTrips();

  useEffect(() => {
    async function fetchData() {
      try {
        if (currentUser != null) {
          const colRef = collection(db, "trips");
          const q = query(colRef, where("owner_id", "==", currentUser.uid));

          const docSnap = await getDocs(q);
          if (docSnap.empty) return;

          docSnap.docs.forEach((trip) => {
            setPayload((trips) => [...trips, trip.data()]);
          });
        } else {
          const docSnap = JSON.parse(localStorage.getItem("trips") || "");
          setPayload(docSnap);
        }
      } catch (error) {
        setError("failed to fetch user trips");
        console.log(error);
      } finally {
        setLoading(false);
        setNewlyFetched(true);
      }
    }

    fetchData();
  }, []);

  if (!loading && newlyFetched) {
    setTimeout(() => {
      dispatch({ type: ACTIONS.REPLACE, payload: payload });
    }, 0);
    setNewlyFetched(false);
  }
  return { loading, error, userTrips, dispatch, ACTIONS };
}
