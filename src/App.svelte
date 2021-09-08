<script lang="ts">
  import RootFile from "./components/RootFile.svelte";
  import File from "./components/File.svelte";
</script>

<div class="wrapper">
  <div class="tree">
    <div class="header">
      <h1>Tree</h1>
      <div class="search">search</div>
    </div>

    <RootFile>
      <File name="public" />
      <File name="leden" />
      <File name="zoeken" />
    </RootFile>
  </div>

  <div class="content">
    <div class="header">
      <h1>Content</h1>
    </div>
  </div>

  <div class="properties">
    <div class="header">
      <h1>Properties</h1>
    </div>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
  }

  .tree,
  .properties,
  .content {
    width: 30em;
    height: 100vh;
    padding: 0em 1em;
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
    justify-content: space-between;
    align-items: center;
  }

  .search {
    color: var(--inactive-color);
  }
</style>
