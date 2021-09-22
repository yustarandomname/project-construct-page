<script lang="ts">
  import type { Content } from "../types/database";

  import { updateDoc, arrayUnion } from "firebase/firestore";

  import content from "../stores/contentStore";

  import Button from "../components/Button.svelte";
  import InputButton from "../components/InputButton.svelte";
  import SubmitButton from "../components/SubmitButton.svelte";
  import ImageButton from "../components/ImageButton.svelte";
  import ContentCard from "../components/ContentCard.svelte";
  import { mdiCancel, mdiDetails, mdiImage, mdiLink, mdiSend, mdiText } from "@mdi/js";

  let submitLoading = false;
  let newContent: Content = {
    title: "",
    description: "",
    image: "",
    author: "",
    url: "",
    type: "none",
  };
  let defaultNewContent = { ...newContent };

  // Reset the form
  function resetContentData() {
    newContent = { ...defaultNewContent };
    submitLoading = false;
  }

  // Send the content to the database
  async function addContent() {
    submitLoading = true;
    await updateDoc($content.ref, {
      content: arrayUnion(newContent),
    });

    content.addData(newContent);

    // Reset the form content data
    resetContentData();
  }

  // Send link to server to return (meta/header) content
  async function handleLink() {
    submitLoading = true;
    const urlData = await fetch(`https://shielded-bayou-35691.herokuapp.com/scraper?link=${newContent.url}`);
    const data = await urlData.json();

    newContent = {
      title: newContent.title || data.title,
      description: newContent.description || data.description,
      image: newContent.image || data.image,
      url: data.url,
      author: data.author,
      type: newContent.type,
    };

    addContent();
  }

  function handleImage() {
    console.log(newContent.image);
  }
</script>

<div class="newContent">
  <div class="subHeader">Add new Content</div>
  {#if newContent.type == "none"}
    <div class="newContentSplit">
      <Button on:click={() => (newContent.type = "link")} icon={mdiLink}>New link</Button>
      <Button on:click={() => (newContent.type = "text")} icon={mdiText}>New Text</Button>
      <Button on:click={() => (newContent.type = "image")} icon={mdiImage}>New image</Button>
    </div>
  {:else if newContent.type == "link"}
    <form on:submit|preventDefault={handleLink}>
      <InputButton placeholder="Title" bind:value={newContent.title} noSubmit noCancel />
      <InputButton placeholder="Link url" bind:value={newContent.url} noSubmit noCancel />

      <div class="newContentSplit">
        <Button on:click={resetContentData} icon={mdiCancel}>Cancel</Button>
        <SubmitButton large loading={submitLoading} icon={mdiSend} --background="var(--active-color)">Submit</SubmitButton>
      </div>
    </form>
  {:else if newContent.type == "text"}
    <form on:submit|preventDefault={addContent}>
      <InputButton placeholder="Title" bind:value={newContent.title} noSubmit noCancel />
      <InputButton placeholder="Description" bind:value={newContent.description} noSubmit noCancel />

      <div class="newContentSplit">
        <Button on:click={resetContentData} icon={mdiCancel}>Cancel</Button>
        <SubmitButton large loading={submitLoading} icon={mdiSend} --background="var(--active-color)">Submit</SubmitButton>
      </div>
    </form>
  {:else if newContent.type == "image"}
    <form on:submit|preventDefault={addContent}>
      <div class="newContentSplit">
        <div class="input">
          <InputButton placeholder="Title" bind:value={newContent.title} noSubmit noCancel />
          <ImageButton
            on:save={(data) => {
              newContent.image = data.detail.url;
              newContent.title = newContent.title || data.detail.title;
            }}
          />
        </div>
        {#if newContent.image}
          <div class="preview" style="background: url({newContent.image});" />
        {/if}
      </div>

      <div class="newContentSplit">
        <Button on:click={resetContentData} icon={mdiCancel}>Cancel</Button>
        <SubmitButton large loading={submitLoading} icon={mdiSend} --background="var(--active-color)">Submit</SubmitButton>
      </div>
    </form>
  {/if}
</div>

{#if $content.data.length}
  <div class="content">
    {#each $content.data as contentItem}
      <ContentCard data={contentItem} ref={$content.ref} />
    {/each}
  </div>
{:else}
  <p style="color:var(--inactive-color); text-align: center;">
    Hier kun je plaatjes, schetsen, inspiratie, meeting notities, en andere langere content neerzetten
  </p>
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

  .newContentSplit {
    display: flex;
    gap: 1em;
    margin-top: 0.5em;
  }

  .preview {
    background-size: cover !important;
    background-position: center !important;
    width: 10em;
  }
</style>
