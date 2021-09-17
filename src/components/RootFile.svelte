<script lang="ts">
  import type { DocumentReference, DocumentData } from "@firebase/firestore";
  import type { Page } from "../types/database";
  import { getFirestore, getDoc } from "firebase/firestore";
  import { mdiPlus } from "@mdi/js";

  import { handleNewPage } from "../util/page";

  import Button from "./Button.svelte";
  import InputButton from "./InputButton.svelte";
  import File from "./File.svelte";
  import Collection from "../sveltefire/Collection.svelte";

  import openStore from "../stores/openStore";
  import properties from "../stores/propertyStore";
  import content from "../stores/contentStore";

  export let ref: DocumentReference<DocumentData>;

  let data: Page;
  let newPageVisible = false;
  let newPageName: string = "";

  async function getRootFile() {
    const file = await getDoc(ref);
    data = file.data() as Page;

    properties.set({ props: data.properties, ref, parentRef: null });
    content.set(data.content, ref);

    return data;
  }

  function setHome(page: Page) {
    openStore.setHome();
    content.set([], ref);
    properties.set({ props: page.properties, ref, parentRef: null });
  }

  function closeNewPage() {
    newPageVisible = false;
    newPageName = "";
  }

  const db = getFirestore();
</script>

{#await getRootFile()}
  <Button state="active">Root</Button>
{:then data}
  {#if data.children > 0 || newPageVisible}
    <div class="attach-below">
      <Button state="active" on:click={() => setHome(data)}>{data.properties.name}</Button>

      <div class="content">
        <div class="line" />
        <div class="pages">
          <Collection path={ref.path + "/components"} let:data={children}>
            {#each children as child}
              <File
                ref={child.ref}
                data={child}
                parentProperties={{ props: data.properties, ref: child.ref, parentRef: ref, path: ["Root", child?.properties.name] }}
              />
            {/each}
          </Collection>

          {#if newPageVisible}
            <InputButton
              on:cancel={closeNewPage}
              on:submit={() => handleNewPage(db, newPageName, ref, closeNewPage)}
              bind:value={newPageName}
              prependLine={true}
            />
          {/if}
        </div>
      </div>
      <Button size="small" icon={mdiPlus} --margin="0 0.35em" on:click={() => (newPageVisible = true)} />
    </div>
  {:else}
    <div class="attach-right">
      <Button state="active">{data.properties.name}</Button>

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
