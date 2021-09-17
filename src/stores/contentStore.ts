import type { DocumentReference, DocumentData } from "@firebase/firestore";
import { writable } from "svelte/store";

interface Content {
  title: string;
  description: string;
  image?: string;
  author?: string;
  url?: string;
}

function createContentStore() {
  const { subscribe, set } = writable({ data: [] as Content[], ref: null as DocumentReference<DocumentData> });

  return {
    subscribe,
    set: (data: Content[], ref: DocumentReference<DocumentData>) => set({ data, ref }),
  };
}

export default createContentStore();
