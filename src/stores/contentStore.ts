import type { DocumentReference, DocumentData } from "@firebase/firestore";
import { writable } from "svelte/store";

interface Content {
  title: string;
  description: string;
  image?: string;
  author?: string;
  url?: string;
}

let content = { data: [] as Content[], ref: null as DocumentReference<DocumentData> };

function createContentStore() {
  const { subscribe, set } = writable(content);

  return {
    subscribe,
    set: (data: Content[], ref: DocumentReference<DocumentData>) => {
      content = { data, ref };
      return set(content);
    },
    setData: (data: Content[]) => {
      content.data = data;
      return set(content);
    },
    addData: (data: Content) => {
      content.data = [...content.data, data];
      return set(content);
    },
    removeData: (data: Content) => {
      content.data = content.data.filter((item) => item !== data);
      return set(content);
    },
  };
}

export default createContentStore();
