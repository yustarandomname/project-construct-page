<script lang="ts">
  import type { DocumentReference, DocumentData } from "@firebase/firestore";
  import type { Page } from "../types/database";
  import { getFirestore, collection, getDoc, getDocs, query, orderBy } from "firebase/firestore";

  import { mdiPlus } from "@mdi/js";
  import Button from "./Button.svelte";
  import File from "./File.svelte";

  import properties from "../stores/propertyStore";

  export let ref: DocumentReference<DocumentData>;

  const db = getFirestore();

  async function getRootFile() {
    const file = await getDoc(ref);
    const fileData = file.data() as Page;

    properties.set(fileData.properties);

    return fileData;
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

{#await getRootFile()}
  <Button state="active">Home</Button>
{:then data}
  {#if data.children > 0}
    <div class="attach-below">
      <Button state="active">{data.name}</Button>

      <div class="content">
        <div class="line" />
        <div class="pages">
          {#await getChildren()}
            {#each new Array(data.children) as _}
              <Button>Loading</Button>
            {/each}
          {:then children}
            {#each children as child}
              <File ref={child.ref} data={child.data} parentProperties={data.properties} />
            {/each}
          {/await}
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
