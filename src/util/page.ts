import type { DocumentReference, DocumentData, Firestore } from "@firebase/firestore";
import { collection, addDoc, updateDoc, increment } from "firebase/firestore";

export const handleNewPage = async (db: Firestore, name: string, ref: DocumentReference<DocumentData>, next: () => void) => {
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
