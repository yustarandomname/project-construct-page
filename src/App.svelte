<script lang="ts">
  import { initializeApp } from "firebase/app";
  import { getFirestore, doc } from "firebase/firestore";

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

  <div class="properties">
    <div class="header">
      <h1>Properties</h1>
    </div>
    <Properties />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
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
</style>
