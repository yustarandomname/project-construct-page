<script lang="ts">
  import properties from "../stores/propertyStore";
  import Button from "../components/Button.svelte";
  import InputButton from "../components/InputButton.svelte";
  import { mdiArrowUp, mdiArrowDown, mdiDelete, mdiPlus, mdiExclamation, mdiUpdate } from "@mdi/js";
  import { deleteDoc, updateDoc, increment } from "firebase/firestore";

  let changes = 0;
  let newPermission = "";
  let addPermissionInput = false;

  function onInit(p) {
    let newProperties = { ...$properties };

    if (!newProperties.props?.topFeatures) {
      newProperties.props.topFeatures = ["", "", ""];
    }

    properties.set(newProperties);
  }

  async function setProperties(newProperties) {
    console.log(newProperties.props);
    await updateDoc($properties.ref, {
      properties: newProperties.props,
    });

    properties.set(newProperties);
  }

  // PERMISSIONS
  function cancelNewPermission() {
    newPermission = "";
    addPermissionInput = false;
  }

  async function handleNewPermission() {
    const newProperties = { ...$properties };

    if (newProperties.props.permissions) {
      newProperties.props.permissions.push(newPermission);
    } else {
      newProperties.props.permissions = [newPermission];
    }

    setProperties(newProperties);
    cancelNewPermission();
  }

  async function removePermission(index) {
    const newProperties = { ...$properties };
    newProperties.props.permissions.splice(index, 1);

    setProperties(newProperties);
    cancelNewPermission();
  }

  async function handleEditPermission(permission, index) {
    const newProperties = { ...$properties };
    newProperties.props.permissions[index] = permission;

    setProperties(newProperties);
    cancelNewPermission();
  }

  // TOP FEATURES
  async function cancelFeature(index: number) {
    const newProperties = { ...$properties };
    newProperties.props.topFeatures[index] = "";
    setProperties(newProperties);
  }

  async function deleteRef() {
    // TODO: implement: are you sure dialog
    if ($properties.props.name == "Root") return;

    await deleteDoc($properties.ref);
    await updateDoc($properties.parentRef, {
      children: increment(-1),
    });
  }

  async function updateRef() {
    // TODO: implement updating ref
    console.log("update");
  }

  $: onInit($properties);
</script>

<div class="propertyWrapper">
  <div class="subHeader">Name</div>
  <InputButton
    --margin="0em"
    on:submit={() => {
      console.log("set props name", $properties.props.name);
      setProperties($properties);
    }}
    bind:value={$properties.props.name}
    noCancel
  />

  <div class="subHeader">Move</div>
  <div class="splitButtons">
    <Button size="large" icon={mdiArrowUp} disabled>Up</Button>
    <Button size="large" icon={mdiArrowDown} disabled>Down</Button>
  </div>

  <div class="subHeader">Permissions</div>
  {#if $properties.props.permissions}
    {#each $properties?.props.permissions as permission, index}
      <InputButton
        --margin="0em"
        size="large"
        on:submit={() => handleEditPermission(permission, index)}
        on:cancel={() => removePermission(index)}
        bind:value={permission}
        placeholder="edit permission"
      />
    {/each}
  {/if}
  {#if addPermissionInput}
    <InputButton
      --margin="0em"
      size="large"
      on:submit={handleNewPermission}
      on:cancel={cancelNewPermission}
      bind:value={newPermission}
      placeholder="enter new permission"
    />
  {:else}
    <Button size="large" icon={mdiPlus} on:click={() => (addPermissionInput = true)}>Add Permission</Button>
  {/if}

  <div class="subHeader">Top 3 features</div>
  {#each new Array(3) as _, index}
    <InputButton
      --margin="0em"
      on:submit={() => setProperties($properties)}
      on:cancel={() => cancelFeature(index)}
      bind:value={$properties.props.topFeatures[index]}
      placeholder={"Top feature" + (index + 1)}
    />
  {/each}

  <div class="subHeader">Quick Notes</div>
  <Button size="large" icon={mdiPlus}>Add Note</Button>

  <div class="subHeader">Actions</div>
  <Button size="large" icon={mdiDelete} state="destructive" on:click={deleteRef}>Delete</Button>
  {#if changes > 0}
    <Button size="large" icon={mdiUpdate} state="active" on:click={updateRef}>Update</Button>
  {/if}
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
