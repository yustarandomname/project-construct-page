<script lang="ts">
  import properties from "../stores/propertyStore";
  import Button from "../components/Button.svelte";
  import { mdiArrowUp, mdiArrowDown, mdiDelete, mdiPlus, mdiExclamation } from "@mdi/js";
  import { deleteDoc } from "firebase/firestore";

  async function deleteRef() {
    if ($properties.props.name == "Home") return;

    await deleteDoc($properties.ref);
  }
</script>

<div class="propertyWrapper">
  <div class="subHeader">Name</div>
  <p>{$properties.props.name}</p>

  <div class="subHeader">Move</div>
  <div class="splitButtons">
    <Button size="large" icon={mdiArrowUp}>Up</Button>
    <Button size="large" icon={mdiArrowDown}>Down</Button>
  </div>

  <div class="subHeader">Permissions</div>
  {#if $properties.props.permissions}
    {#each $properties?.props.permissions as permission}
      <p>{permission}</p>
    {/each}
  {/if}
  <Button size="large" icon={mdiPlus}>Add Permission</Button>

  <div class="subHeader">Top 3 features</div>
  <Button size="large" icon={mdiExclamation}>...</Button>
  <Button size="large" icon={mdiExclamation}>...</Button>
  <Button size="large" icon={mdiExclamation}>...</Button>

  <div class="subHeader">Quick Notes</div>
  <Button size="large" icon={mdiPlus}>Add Note</Button>

  <div class="subHeader">Remove</div>
  <Button size="large" icon={mdiDelete} state="destructive" on:click={deleteRef}>Delete</Button>
</div>

<style>
  .propertyWrapper {
    --margin: 0.5em 0 0 0;
  }

  .subHeader {
    font-size: 1.25em;
    font-weight: bold;
  }

  .subHeader:not(:first-child) {
    margin-top: 1em;
  }

  .splitButtons {
    display: flex;
    gap: 1em;
  }
</style>
