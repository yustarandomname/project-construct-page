<script lang="ts">
  import type { DocumentReference, DocumentData } from "@firebase/firestore";
  import type { Page, Properties } from "../types/database";
  import { getFirestore, collection, getDoc, getDocs, query, orderBy } from "firebase/firestore";

  import { mdiPlus } from "@mdi/js";
  import Button from "./Button.svelte";

  import properties from "../stores/propertyStore";

  export let ref: DocumentReference<DocumentData>;
  export let data: Page;
  export let parentProperties: Properties;

  let isOpen = false;
  const db = getFirestore();

  function toggleOpen() {
    if (isOpen) {
      properties.set(parentProperties);
      isOpen = false;
    } else {
      properties.set(data.properties);
      isOpen = true;
    }
  }

  async function getChildren() {
    const childrenRef = collection(db, ref.path + "/components");
    const queryChildren = query(childrenRef, orderBy("properties.index"));
    const children = await getDocs(queryChildren);

    let res: { ref: DocumentReference<DocumentData>; data: Page }[] = [];
    children.forEach((child) => {
      res.push({
        ref: child.ref,
        data: child.data() as Page,
      });
    });

    return res;
  }
</script>

<div class="file attach-left">
  <div class="line" class:hasPermission={false} />
  {#if data.children > 0}
    <div class="attach-below">
      <Button state={isOpen ? "active" : "default"} on:click={toggleOpen}>{data.name}</Button>

      {#if isOpen}
        <div class="content">
          <div class="line" />
          <div class="pages">
            {#await getChildren()}
              {#each new Array(data.children) as _}
                <Button>Loading</Button>
              {/each}
            {:then children}
              {#each children as child}
                <svelte:self ref={child.ref} data={child.data} parentProperties={data.properties} />
              {/each}
            {/await}
          </div>
        </div>
        <Button size="small" icon={mdiPlus} --margin="0 0.35em" />
      {/if}
    </div>
  {:else}
    <div class="attach-right">
      <Button state={isOpen ? "active" : "default"} on:click={toggleOpen}>{data.name}</Button>

      <div class="line" />
      <Button size="small" icon={mdiPlus} />
    </div>
  {/if}
</div>

<style>
  /* Global */
  .file {
    margin: 0.75rem 0;
  }

  /* Start / End */
  .attach-left,
  .attach-right {
    display: flex;
  }

  .attach-right {
    align-items: center;
  }

  .attach-right > .line,
  .attach-left > .line {
    height: 2px;
    width: 0.5em;
    background: var(--inactive-color);
  }

  .attach-left > .line {
    margin-top: 1em;
  }

  /* Long line */
  .attach-below .content {
    display: flex;
  }

  .attach-below > .content > .line {
    height: auto;
    margin: 0 0 0 1em;
    width: 2px;
    background: var(--inactive-color);
  }

  /* Has Permission */
  .hasPermission.line {
    background: var(--destructive-color);
  }
</style>
