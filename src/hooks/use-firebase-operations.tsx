import { User } from "firebase/auth";
import {
  DocumentReference,
  FirestoreError,
  Transaction,
  addDoc,
  collection,
  doc,
  runTransaction,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";

import { db } from "@/lib/firebase";
import { getFirebaseStarterTrip } from "@/config/template-data";
import { Trip, Event } from "@/types";

export const firebaseCreateUser = async (user: User, username: string, country: string, sex: string) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    username: username,
    country: country,
    sex: sex,
  });
};

export const createStarterTrip = async (user: User) => {
  const { trip, events } = getFirebaseStarterTrip();
  trip.owner_id = user.uid;

  const createTripAndEventsTransaction = async (transaction: Transaction) => {
    const tripsRef = collection(db, "trips");
    const newTripRef = doc(tripsRef);

    // Create the new trip document
    transaction.set(newTripRef, trip);

    // Add events as a sub collection to the new trip document
    const eventsRef = collection(newTripRef, "events");
    for (const event of events) {
      const eventDocRef = doc(eventsRef);
      transaction.set(eventDocRef, event);
    }
  };

  await runTransaction(db, createTripAndEventsTransaction);
};

export const firebaseCreateTrip = async (user: User, trip: Trip, events?: Event[]) => {
  const batch = writeBatch(db);

  try {
    const tripsRef = collection(db, "trips");
    const tripDocRef = doc(tripsRef); // Create a new trip reference

    // Add the new trip document to the batch
    batch.set(tripDocRef, trip);
    trip.id = tripDocRef.id;
    trip.owner_id = user.uid;
    trip.metadata = { created_at: Date.now(), updated_at: Date.now() };

    // Add events as a sub-collection to the new trip document (if provided)
    if (events) {
      events.forEach((event) => {
        const eventsRef = collection(tripDocRef, "events");
        const eventDocRef = doc(eventsRef); // Create a new event reference

        // Add each event document to the batch
        batch.set(eventDocRef, event);
        event.id = eventDocRef.id;
      });
    }

    // Commit the batched write
    // await batch.commit();
  } catch (error) {
    // Handle specific error types
    if (error instanceof FirebaseError) {
      if (error.code === "permission-denied") {
        console.log("Permission denied. You might not have access to write to the database.");
      } else {
        console.log("An error occurred:", error.message);
      }
    } else {
      console.log("An unknown error occurred:", error);
    }
  }

  return { trip, events };
};

export const firebaseUpdateTrip = async (trip: Trip) => {
  const { id, itinerary, ..._trip } = trip;
  const tripRef = doc(db, "trips", id);
  // await updateDoc(tripRef, _trip);
};

export const firebaseAddEvent = async (tripId: string, event: Event) => {
  const collectionRef = collection(db, `trips/${tripId}/events`);
  const { id, drag_type, ...eventData } = event;
  try {
    return (await addDoc(collectionRef, eventData)) as DocumentReference;
  } catch (error) {
    return error as FirestoreError;
  }
};

export const firebaseUpdateEvents = async (trip: Trip) => {
  const batch = writeBatch(db);

  try {
    trip.metadata.updated_at = Date.now();

    const events = trip.itinerary?.flatMap((day) => day.events);
    events?.forEach((event) => {
      const eventRef = doc(db, `trips/${trip.id}/events/${event.id}`);
      batch.update(eventRef, event);
    });

    // Commit the batched write
    // await batch.commit();
  } catch (error) {
    console.error("Error updating events in batch:", error);
  }
};
