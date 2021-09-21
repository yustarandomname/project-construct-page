<script lang="ts">
  import toAscii from "punycode2/to-ascii";
  import type { DocumentReference, DocumentData } from "@firebase/firestore";
  import type { Page, Properties } from "../types/database";

  import { getFirestore } from "firebase/firestore";
  import { handleNewPage } from "../util/page";
  import { importanceNames } from "../util/importance";

  import { mdiPlus } from "@mdi/js";
  import openStore from "../stores/openStore";
  import Button from "./Button.svelte";
  import InputButton from "./InputButton.svelte";
  import Collection from "../sveltefire/Collection.svelte";

  import properties from "../stores/propertyStore";
  import content from "../stores/contentStore";

  export let ref: DocumentReference<DocumentData>;
  export let data: Page;
  export let parentProperties: {
    props: Properties;
    ref: DocumentReference<DocumentData>;
    parentRef: DocumentReference<DocumentData>;
    path: string[];
  };

  let newPageVisible = false;
  let newPageName: string = "";

  function openPage() {
    properties.set({ props: data.properties, ref, parentRef: parentProperties.parentRef });
    content.set(data.content, ref);
    openStore.set(parentProperties.path);
  }

  function closeNewPage() {
    newPageVisible = false;
    newPageName = "";
  }

  const db = getFirestore();

  console.log("\uD83D\uDE03", toAscii("\uD83D\uDE03"));
</script>

<div class="file attach-left">
  {#if data.properties.importance > 0}
    <div class="importance">{importanceNames[data.properties.importance]}</div>
  {/if}

  <div class="line" class:hasPermission={false} />
  {#if data.children > 0 || newPageVisible}
    <div class="attach-below">
      <Button state={$openStore.last == data.properties.name ? "active" : "default"} on:click={openPage}
        >{data.properties.name} ({data.children})</Button
      >

      {#if $openStore.path.includes(data.properties.name) || newPageVisible}
        <div class="content">
          <div class="line" />
          <div class="pages">
            <Collection path={ref.path + "/components"} sortBy="properties.importance" sortByDirection="desc" let:data={children}>
              {#each children as child}
                <svelte:self
                  ref={child.ref}
                  data={child}
                  parentProperties={{
                    props: data.properties,
                    ref: child.ref,
                    parentRef: ref,
                    path: [...parentProperties.path, child.properties.name],
                  }}
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

        {#if !newPageVisible}
          <Button size="small" icon={mdiPlus} --margin="0 0.35em" on:click={() => (newPageVisible = true)} />
        {/if}
      {/if}
    </div>
  {:else}
    <div class="attach-right">
      <Button state={$openStore.last == data.properties.name ? "active" : "default"} on:click={openPage}
        >{data.properties.name} ({data.children})</Button
      >

      <div class="line" />
      <Button size="small" icon={mdiPlus} on:click={() => (newPageVisible = true)} />
    </div>
  {/if}
</div>

<style>
  /* Global */
  .file {
    margin: 0.75rem 0;
    position: relative;
  }

  .importance {
    position: absolute;
    left: 1rem;
    top: -0.35rem;
    /* background: white; */
    color: var(--inactive-color);
    text-transform: uppercase;
    font-size: 0.6em;
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
