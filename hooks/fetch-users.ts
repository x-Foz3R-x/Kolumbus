"use client";

import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "@/context/auth";
import { db } from "@/lib/firebase";

export default function useFetchUsers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<object | null>(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUsers(docSnap.data());
      } catch (error) {
        setError("failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return;
}
