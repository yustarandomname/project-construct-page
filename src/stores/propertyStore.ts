import { writable } from "svelte/store";
import type { Properties } from "../types/database";

const defaultProperty: Properties = { name: "no name" };

function createPropertyStore() {
  const { subscribe, set } = writable(defaultProperty);

  return {
    subscribe,
    set,
    reset: () => set(defaultProperty),
  };
}

export default createPropertyStore();
