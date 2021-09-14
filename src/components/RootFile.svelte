<script lang="ts">
  import type { DocumentReference, DocumentData } from "@firebase/firestore";
  import type { Page } from "../types/database";
  import { getDoc } from "firebase/firestore";

  import { mdiPlus } from "@mdi/js";
  import Button from "./Button.svelte";
  import File from "./File.svelte";
  import Collection from "../sveltefire/Collection.svelte";

  import properties from "../stores/propertyStore";

  export let ref: DocumentReference<DocumentData>;

  async function getRootFile() {
    const file = await getDoc(ref);
    const fileData = file.data() as Page;

    properties.set({ props: fileData.properties, ref, parentRef: null });

    return fileData;
  }
</script>

{#await getRootFile()}
  <Button state="active">Home</Button>
{:then data}
  {#if data.children > 0}
    <div class="attach-below">
      <Button state="active">{data.name}</Button>

      <div class="content">
        <div class="line" />
        <div class="pages">
          <Collection path={ref.path + "/components"} let:data={children}>
            {#each children as child}
              <File ref={child.ref} data={child} parentProperties={{ props: data.properties, ref: child.ref, parentRef: ref }} />
            {/each}
          </Collection>
        </div>
      </div>
      <Button size="small" icon={mdiPlus} --margin="0 0.35em" />
    </div>
  {:else}
    <div class="attach-right">
      <Button state="active">{data.name}</Button>

      <div class="line" />
      <Button size="small" icon={mdiPlus} />
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
