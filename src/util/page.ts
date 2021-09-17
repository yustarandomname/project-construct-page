import type { DocumentReference, DocumentData } from "@firebase/firestore";
import { getFirestore, collection, addDoc, updateDoc, increment } from "firebase/firestore";

const db = getFirestore();

export const handleNewPage = async (name: string, ref: DocumentReference<DocumentData>, next: () => void) => {
  if (name) {
    const collectionRef = collection(db, ref.path + "/components");

    await addDoc(collectionRef, {
      children: 0,
      content: [],
      properties: { name },
    });

    await updateDoc(ref, {
      children: increment(1),
    });

    next();
  }
};
