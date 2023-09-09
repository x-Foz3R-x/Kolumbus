"use client";

import { useState, useContext, createContext, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { firebaseCreateUser, createStarterTrip } from "@/hooks/use-firebase-operations";

import ItinerarySkeleton from "@/components/loading/itinerary-skeleton";
import Spinner from "@/components/loading/spinner";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children, LoadingIndicator = "" }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const LoadingIndicatorComponent = () => {
    switch (LoadingIndicator) {
      case "spinner":
        return <Spinner />;
      case "/itinerary":
        return <ItinerarySkeleton />;
      default:
        return null;
    }
  };

  async function signin(email, password, isRememberChecked) {
    try {
      if (!isRememberChecked) await auth.setPersistence(browserSessionPersistence);
      return signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error.code);
    }
  }

  async function signup({ email, password, username, country, sex }) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      await updateProfile(user, {
        displayName: username,
      });

      await firebaseCreateUser(user, username, country, sex);
      await createStarterTrip(user);

      await sendEmailVerification(user);

      setCurrentUser(userCredentials);
      setLoading(false);

      signout();

      return userCredentials;
    } catch (error) {
      console.log(error);
    }
  }

  function signout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signin,
    signup,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : LoadingIndicatorComponent()}
    </AuthContext.Provider>
  );
}
