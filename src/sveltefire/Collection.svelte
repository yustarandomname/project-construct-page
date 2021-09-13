<script lang="ts">
  import type { Unsubscribe } from "firebase/firestore";
  import { getFirestore, collection, onSnapshot, query, orderBy } from "firebase/firestore";
  import { onDestroy } from "svelte";

  export let path: string;
  export let sortBy: string = "";
  export let sortByDirection: "asc" | "desc" = "asc";
  const db = getFirestore();

  let _loading = true;
  let _ref = collection(db, path);
  let _query = sortBy ? query(_ref, orderBy(sortBy, sortByDirection)) : _ref;
  let _data: Array<Object> | null = [];
  let _error: Error;
  let _unsub: Unsubscribe;

  _unsub = onSnapshot(_query, (snapshot) => {
    _data = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ref: doc.ref,
        ...doc.data(),
      };
    });
  });

  onDestroy(() => _unsub());
</script>

{#if _data}
  <slot data={_data} ref={_ref} error={_error} />
{:else if _loading}
  <slot name="loading" />
{:else}
  <slot name="fallback" />
{/if}
