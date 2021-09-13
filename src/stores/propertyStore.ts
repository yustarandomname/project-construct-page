import type { Properties } from "../types/database";
import type { DocumentReference, DocumentData } from "@firebase/firestore";

import { writable } from "svelte/store";

const defaultProperty: { props: Properties; ref: DocumentReference<DocumentData> } = { props: { name: "no name" }, ref: null };

function createPropertyStore() {
  const { subscribe, set } = writable(defaultProperty);

  return {
    subscribe,
    set,
    reset: () => set(defaultProperty),
  };
}

export default createPropertyStore();
