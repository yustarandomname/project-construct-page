<script lang="ts">
  import type { DocumentReference, DocumentData } from "@firebase/firestore";
  import type { Content } from "../types/database";

  import { updateDoc, arrayRemove } from "firebase/firestore";
  import { mdiOpenInNew, mdiClose } from "@mdi/js";
  import content from "../stores/contentStore";

  import Icon from "./Icon.svelte";
  import Button from "./Button.svelte";

  export let data: Content;
  export let ref: DocumentReference<DocumentData>;

  async function removeContent() {
    await updateDoc(ref, {
      content: arrayRemove(data),
    });
    content.removeData(data);
  }

  function getHostname(url: string) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  }
</script>

<div class="card {data.type}-type">
  <div class="subHeader">{data.title}</div>
  <div class="description">{data.description}</div>

  {#if data.type !== "text"}
    <a class="link" href={data.url || data.image} target="_blank">{getHostname(data.url) || getHostname(data.image)} <Icon path={mdiOpenInNew} /></a>
  {/if}

  <div class="image" style="background:url({data.image})" />

  <div class="actions">
    {#if data.type !== "text"}
      <Button on:click={() => window.open(data.url, "_blank").focus()} icon={mdiOpenInNew} line size="small" />
    {/if}
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
    margin-bottom: 1.5rem;
    display: grid;
    grid-template-areas:
      "title title image"
      "description description image"
      "description description image"
      "link link image";
    grid-gap: 0.3em 1em;
  }

  .image-type {
    grid-template-areas:
      "image image image"
      "title title link"
      "description description description";
  }

  .description-type {
    grid-template-areas:
      "title title title"
      "description description description"
      "description description description";
  }

  .subHeader {
    grid-area: title;
    font-size: 1.25em;
    font-weight: bold;
  }

  .description {
    grid-area: description;
    color: var(--inactive-color);
    margin: 0.2rem;
  }

  .image {
    grid-area: image;
    min-width: 15rem;
    min-height: 10rem;
    background-size: cover !important;
    background-position: center center !important;
  }

  .image-type > .image {
    min-height: 15em;
  }

  .link {
    grid-area: link;
    text-decoration: none;
  }

  .actions {
    position: absolute;
    right: -2rem;
  }

  :global(.actions > div) {
    margin-bottom: 0.5em;
  }
</style>
