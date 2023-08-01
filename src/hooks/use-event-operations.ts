import { collection, addDoc, DocumentReference, FirestoreError } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types";

export default function useEventOperations(tripId: string) {
  const collectionRef = collection(db, `trips/${tripId}/events`);

  const addEvent = async (newEventData: Event) => {
    try {
      return (await addDoc(collectionRef, newEventData)) as DocumentReference;
    } catch (error) {
      return error as FirestoreError;
    }
  };

  const updateEvent = async (eventId: string, updatedEventData: Event) => {
    //   try {
    //     await updateDoc(doc(collectionRef, eventId), updatedEventData);
    //     setError(null);
    //   } catch (error) {
    //     setError(error);
    //   }
  };

  const deleteEvent = async (eventId: string) => {
    // try {
    //   await deleteDoc(doc(collectionRef, eventId));
    //   setError(null);
    // } catch (error) {
    //   setError(error);
    // }
  };

  return { addEvent, updateEvent, deleteEvent };
}
