<script lang="ts">
  import type { DocumentReference, DocumentData } from "@firebase/firestore";
  import type { Page } from "../types/database";
  import { getFirestore, collection, addDoc, updateDoc, increment } from "firebase/firestore";
  import { getDoc } from "firebase/firestore";

  import { mdiPlus } from "@mdi/js";
  import Button from "./Button.svelte";
  import InputButton from "./InputButton.svelte";
  import File from "./File.svelte";
  import Collection from "../sveltefire/Collection.svelte";

  import openStore from "../stores/openStore";
  import properties from "../stores/propertyStore";

  export let ref: DocumentReference<DocumentData>;

  const db = getFirestore();
  let newPageVisible = false;
  let newPageName: string = "";
  let newPageDisabled = false;

  async function getRootFile() {
    const file = await getDoc(ref);
    const fileData = file.data() as Page;

    properties.set({ props: fileData.properties, ref, parentRef: null });

    return fileData;
  }

  function setHome(page: Page) {
    openStore.setHome();
    properties.set({ props: page.properties, ref, parentRef: null });
  }

  function cancelNewPage() {
    newPageDisabled = false;
    newPageVisible = false;
    newPageName = "";
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

      cancelNewPage();
    }
  }
</script>

{#await getRootFile()}
  <Button state="active">Home</Button>
{:then data}
  {#if data.children > 0 || newPageVisible}
    <div class="attach-below">
      <Button state="active" on:click={() => setHome(data)}>{data.name}</Button>

      <div class="content">
        <div class="line" />
        <div class="pages">
          <Collection path={ref.path + "/components"} let:data={children}>
            {#each children as child}
              <File
                ref={child.ref}
                data={child}
                parentProperties={{ props: data.properties, ref: child.ref, parentRef: ref, path: ["Home", child?.properties.name] }}
              />
            {/each}
          </Collection>

          {#if newPageVisible}
            <InputButton on:cancel={cancelNewPage} on:submit={handleNewPage} bind:value={newPageName} prependLine={true} disabled={newPageDisabled} />
          {/if}
        </div>
      </div>
      <Button size="small" icon={mdiPlus} --margin="0 0.35em" on:click={() => (newPageVisible = true)} />
    </div>
  {:else}
    <div class="attach-right">
      <Button state="active">{data.name}</Button>

      <div class="line" />
      <Button size="small" icon={mdiPlus} on:click={() => (newPageVisible = true)} />
    </div>
  {/if}
{/await}

<style>
  /* with Props */
  .attach-below .content {
    display: flex;
  }

  .attach-below .line {
    height: auto;
    margin: 0 0 0 1em;
    width: 2px;
    background: var(--inactive-color);
  }

  /* No Props */
  .attach-right {
    display: flex;
    align-items: center;
  }

  .attach-right > .line {
    height: 2px;
    width: 0.5em;
    background: var(--inactive-color);
  }
</style>
