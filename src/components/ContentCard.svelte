<script lang="ts">
  import type { DocumentReference, DocumentData } from "@firebase/firestore";
  import { updateDoc, arrayRemove } from "firebase/firestore";

  import type { Content } from "../types/database";
  import { mdiOpenInNew, mdiClose } from "@mdi/js";

  import Icon from "./Icon.svelte";
  import Button from "./Button.svelte";

  export let data: Content;
  export let ref: DocumentReference<DocumentData>;

  async function removeContent() {
    await updateDoc(ref, {
      content: arrayRemove(data),
    });
  }
</script>

<div class="card">
  <div class="content">
    <div class="subHeader">{data.title}</div>
    <div style="color:var(--inactive-color); margin: 0.5rem 0.2rem">{data.description}</div>
    <a href={data.url} target="_blank">{data.title}</a>
    <Icon path={mdiOpenInNew} />
  </div>
  <div class="image" style="background:url({data.image})" />
  <div class="actions">
    <Button on:click={() => window.open(data.url, "_blank").focus()} icon={mdiOpenInNew} line size="small" />
    <Button on:click={removeContent} icon={mdiClose} line size="small" />
  </div>
</div>

<style>
  .card {
    position: relative;
    min-height: 10em;
    padding: 1em;
    border: 1px solid black;
    border-radius: 0.3em;
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .subHeader {
    font-size: 1.25em;
    font-weight: bold;
  }

  .content {
    width: calc(100% - 10rem);
  }

  .image {
    width: 15rem;
    height: 10rem;
    background-size: cover !important;
    background-position: center center !important;
  }

  .actions {
    position: absolute;
    right: -2rem;
  }

  :global(.actions > div) {
    margin-bottom: 0.5em;
  }
</style>
