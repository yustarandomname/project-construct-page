<script lang="ts">
  import type { Content } from "../types/database";

  import { updateDoc, arrayUnion } from "firebase/firestore";

  import content from "../stores/contentStore";

  import InputButton from "../components/InputButton.svelte";
  import SubmitButton from "../components/SubmitButton.svelte";
  import ContentCard from "../components/ContentCard.svelte";

  let contentData: Content = {
    title: "",
    description: "",
    image: "",
    author: "",
    url: "",
  };

  // Reset the form
  function resetContentData() {
    contentData = {
      title: "",
      description: "",
      image: "",
      author: "",
      url: "",
    };
  }

  // Send link to server to return (meta/header) content
  async function handleLink() {
    const urlData = await fetch(`http://localhost:3000/scraper?link=${contentData.url}`);
    const data = await urlData.json();
    console.log(data);

    contentData = {
      title: contentData.image || data.title,
      description: contentData.image || data.description,
      image: contentData.image || data.image,
      url: data.url,
      author: data.author,
    };
  }

  async function addContent() {
    // Add the content to the database
    await updateDoc($content.ref, {
      content: arrayUnion(contentData),
    });

    // Reset the form content data
    resetContentData();
  }
</script>

<div class="newContent">
  <div class="subHeader">Add new Content</div>
  <form on:submit|preventDefault={addContent}>
    <InputButton placeholder="Title" bind:value={contentData.title} noSubmit noCancel required />
    <InputButton placeholder="Description" bind:value={contentData.description} noSubmit noCancel required />
    <InputButton placeholder="URL" on:submit={handleLink} bind:value={contentData.url} noCancel />
    <InputButton placeholder="Image" bind:value={contentData.image} noCancel />

    <SubmitButton large --background="var(--active-color)">Submit</SubmitButton>
  </form>
</div>

{#if $content.data.length}
  <div class="content">
    {#each $content.data as contentItem}
      <ContentCard data={contentItem} ref={$content.ref} />
    {/each}
  </div>
{:else}
  <p style="color:var(--inactive-color)">Hier kun je plaatjes, schetsen, inspiratie, meeting notities, en andere langere content neerzetten</p>
{/if}

<style>
  .newContent,
  .content {
    max-width: 40em;
    margin: 0 auto 2em;
  }

  .subHeader {
    font-size: 1.25em;
    font-weight: bold;
  }
</style>
