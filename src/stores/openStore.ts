import { writable } from "svelte/store";

function createOpenStore() {
  const { subscribe, set } = writable({ path: ["Home"], last: "Home" });

  return {
    subscribe,
    set: (path) => set({ path: path, last: path[path.length - 1] }),
    setHome: () => set({ path: ["Home"], last: "Home" }),
  };
}

export default createOpenStore();
