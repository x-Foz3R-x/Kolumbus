"use client";

import React, {
  useState,
  useContext,
  createContext,
  useRef,
  useEffect,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  browserSessionPersistence,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useRef();

  async function signin(email, password, isRememberChecked) {
    try {
      if (!isRememberChecked)
        await auth.setPersistence(browserSessionPersistence);
      return signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error.code);
    }
  }

  async function signup(email, password, username, country, sex) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setCurrentUser(userCredentials);

      const user = userCredentials.user;
      const userRef = doc(db, "users", user.uid);

      await updateProfile(user, {
        displayName: username,
      });

      await setDoc(userRef, {
        username: username,
        country: country,
        sex: sex,
      });

      await sendEmailVerification(user);

      signout();
      return userCredentials;
    } catch (error) {
      console.log(error.code);
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
    userInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
