import { writable } from "svelte/store";

function createOpenStore() {
  const { subscribe, set } = writable({ path: ["Root"], last: "Root" });

  return {
    subscribe,
    set: (path) => set({ path: path, last: path[path.length - 1] }),
    setHome: () => set({ path: ["Root"], last: "Root" }),
  };
}

export default createOpenStore();
