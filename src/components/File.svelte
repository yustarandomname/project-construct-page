<script lang="ts">
  import type { DocumentReference, DocumentData } from "@firebase/firestore";
  import { getFirestore, collection, addDoc, updateDoc, increment } from "firebase/firestore";
  import type { Page, Properties } from "../types/database";

  import { mdiPlus } from "@mdi/js";
  import Button from "./Button.svelte";
  import InputButton from "./InputButton.svelte";
  import Collection from "../sveltefire/Collection.svelte";

  import properties from "../stores/propertyStore";

  export let ref: DocumentReference<DocumentData>;
  export let data: Page;
  export let parentProperties: { props: Properties; ref: DocumentReference<DocumentData> };

  const db = getFirestore();
  let isOpen = false;
  let newPageVisible = false;
  let newPageName: string = "";
  let newPageDisabled = false;

  function setProperties() {
    if (isOpen) properties.set(parentProperties);
    else properties.set({ props: data.properties, ref });
  }

  function toggleOpen() {
    setProperties();
    isOpen = !isOpen;
  }

  async function handleNewPage() {
    if (newPageName) {
      newPageDisabled = true;
      const collectionRef = collection(db, ref.path + "/components");

      await addDoc(collectionRef, {
        name: newPageName,
        children: 0,
        content: {},
        properties: {
          name: newPageName,
        },
      });

      await updateDoc(ref, {
        children: increment(1),
      });

      newPageDisabled = false;
      newPageVisible = false;
      newPageName = "";
    }
  }
</script>

<div class="file attach-left">
  <div class="line" class:hasPermission={false} />
  {#if data.children > 0 || newPageVisible}
    <div class="attach-below">
      <Button state={isOpen ? "active" : "default"} on:click={toggleOpen}>{data.properties.name}</Button>

      {#if isOpen || newPageVisible}
        <div class="content">
          <div class="line" />
          <div class="pages">
            <Collection path={ref.path + "/components"} let:data={children}>
              {#each children as child}
                <svelte:self ref={child.ref} data={child} parentProperties={{ props: data.properties, ref: child.ref }} />
              {/each}
            </Collection>

            {#if newPageVisible}
              <InputButton on:submit={handleNewPage} disabled={newPageDisabled} bind:value={newPageName} />
            {/if}
          </div>
        </div>

        {#if !newPageVisible}
          <Button size="small" icon={mdiPlus} --margin="0 0.35em" on:click={() => (newPageVisible = true)} />
        {/if}
      {/if}
    </div>
  {:else}
    <div class="attach-right">
      <Button state={isOpen ? "active" : "default"} on:click={toggleOpen}>{data.properties.name}</Button>

      <div class="line" />
      <Button size="small" icon={mdiPlus} on:click={() => (newPageVisible = true)} />
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
