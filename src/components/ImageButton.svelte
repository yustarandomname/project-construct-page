<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

  const dispatch = createEventDispatcher();
  const storage = getStorage();
  let files: FileList;
  let imageUrl = "";

  function dispatchSave(title: string, url: string) {
    dispatch("save", { title, url });
  }

  async function uploadImage(f) {
    console.log("files", files, f);
    if (files && files.length) {
      const file = files[0];
      const storageRef = ref(storage, `images/${file.name}`);

      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      dispatchSave(snapshot.metadata.name, url);
      imageUrl = "";
    }
  }

  function handleUrlInput(event: Event) {
    const value = (<HTMLInputElement>event.target).value;

    if (value) {
      dispatchSave("Image", value);
      files = null;
    }
  }

  $: uploadImage(files);
</script>

<form on:submit|preventDefault>
  <input type="file" placeholder="Image file" bind:files />
  <div>or</div>
  <input type="url" placeholder="paste image url" bind:value={imageUrl} on:input={handleUrlInput} />
</form>

<style>
  form {
    display: flex;
    align-items: center;
    margin: 0.75rem 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    cursor: pointer;
    font-size: var(--font-size, 1em);
    transition: 1s box-shadow;
    width: 100%;
  }

  input {
    all: unset;
    padding: 0.5em;
    width: 100%;
  }
</style>
