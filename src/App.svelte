<script lang="ts">
  import { initializeApp } from "firebase/app";
  import { getFirestore, doc } from "firebase/firestore";
  import { mdiClose, mdiChevronLeft, mdiGithub } from "@mdi/js";
  import { fly } from "svelte/transition";

  import Button from "./components/Button.svelte";
  import RootFile from "./components/RootFile.svelte";
  import Content from "./widgets/Content.svelte";
  import Properties from "./widgets/Properties.svelte";

  initializeApp({
    apiKey: "AIzaSyCilQEwzkyJPy98VVrtYbjCRah8q_pXfGs",
    authDomain: "construct-page.firebaseapp.com",
    projectId: "construct-page",
    storageBucket: "construct-page.appspot.com",
    messagingSenderId: "644552624249",
    appId: "1:644552624249:web:a7c2ffdbda50e1ee10aca8",
  });

  const db = getFirestore();
  const docRef = doc(db, "pages", "MWdhMh3lW2vKY1rkjyWl");
  let propertiesVisible = true;
</script>

<div class="wrapper">
  <div class="tree">
    <div class="header">
      <h1>Tree</h1>
    </div>

    <RootFile ref={docRef} />
  </div>

  <div class="content">
    <div class="header">
      <h1>Content</h1>
    </div>
    <Content />
  </div>

  {#if propertiesVisible}
    <div class="properties" transition:fly={{ x: 200 }}>
      <div class="header">
        <h1>Properties</h1>
      </div>
      <Properties />
    </div>

    <div class="positionButton">
      <Button on:click={() => (propertiesVisible = false)} icon={mdiClose} />
    </div>
  {:else}
    <div class="positionButton">
      <Button on:click={() => (propertiesVisible = true)} icon={mdiChevronLeft} />
    </div>
  {/if}

  <div class="positionButton positionGithub">
    <Button on:click={() => window.open("https://github.com/yustarandomname/project-construct-page", "_blank")} icon={mdiGithub} />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    width: 100vw;
    overflow-y: hidden;
  }

  .tree,
  .properties,
  .content {
    min-width: 20em;
    height: 100vh;
    padding: 5.5em 1em 0;
    position: relative;
    overflow-y: auto;
  }

  .tree {
    border-right: 1px solid #000;
  }
  .properties {
    border-left: 1px solid #000;
  }
  .content {
    flex-grow: 1;
  }

  .header {
    display: flex;
    position: fixed;
    top: 0;
    margin-left: -1em;
    padding-left: 1em;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px) saturate(1.5);
  }

  .positionButton {
    position: fixed;
    right: 2em;
    top: 1.5em;
  }

  .positionButton.positionGithub {
    right: 5em;
  }
</style>
