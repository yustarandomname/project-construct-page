<script lang="ts">
  import RootFile from "./components/RootFile.svelte";
  import File from "./components/File.svelte";

  import Properties from "./widgets/Properties.svelte";
</script>

<div class="wrapper">
  <div class="tree">
    <div class="header">
      <h1>Tree</h1>
      <div class="search">search</div>
    </div>

    <RootFile>
      <File name="public">
        <File name="Foto's" hasPermission />
        <File name="Weer" hasPermission />
        <File name="Snelle info" />
      </File>
      <File name="leden" hasPermission>
        <File name="afschrijfboek" />
        <File name="eetlijst" />
        <File name="agenda" />
      </File>
      <File name="zoeken">
        <File name="pagina's" />
        <File name="evenmenten" />
        <File name="fotos" hasPermission />
        <File name="boten" />
        <File name="leden" hasPermission />
        <File name="commissies" />
        <File name="vloten" />
      </File>
      <File name="Commissies">
        <File name="Bixy" hasPermission>
          <File name="Eetlijst aan-maken/passen" hasPermission />
          <File name="Inschrijven voor koken" />
          <File name="Blog schrijven" />
        </File>
        <File name="Webcie" hasPermission>
          <File name="Blog schrijven" />
        </File>
      </File>
      <File name="Bestuur (admin)" hasPermission>
        <File name="Persoon uitschrijven" />
        <File name="Mail schrijven" />
        <File name="Blog schrijven" />
      </File>
    </RootFile>
  </div>

  <div class="content">
    <div class="header">
      <h1>Content</h1>
    </div>
    <p style="color:var(--inactive-color)">Hier kun je plaatjes, schetsen, inspiratie, meeting notities, en andere langere content neerzetten</p>
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
    width: 30em;
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
    width: 20em;
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

  .tree > .header {
    width: 27em;
  }

  .search {
    color: var(--inactive-color);
  }
</style>
