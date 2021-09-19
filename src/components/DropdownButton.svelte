<script lang="ts">
  import { mdiCancel, mdiCheck } from "@mdi/js";
  import { createEventDispatcher } from "svelte";

  import Button from "../components/Button.svelte";
  import SubmitButton from "../components/SubmitButton.svelte";

  export let value: number;
  export let options: string[];

  export let disabled: boolean = false;
  export let noCancel: boolean = false;
  export let noSubmit: boolean = false;

  const dispatch = createEventDispatcher();
  let valueIsChanged = false;

  function dispatchCancel() {
    dispatch("cancel");
    value = 0;
  }

  function dispatchSubmit() {
    dispatch("submit");
    valueIsChanged = false;
  }
</script>

<form on:submit|preventDefault>
  <select class="button" class:disabled on:change={() => (valueIsChanged = true)} bind:value>
    {#each options as option, index}
      <option value={index}>
        {option}
      </option>
    {/each}
  </select>

  {#if !noSubmit && valueIsChanged}
    <div class="line" />
    <div on:click={dispatchSubmit}>
      <SubmitButton --margin="0em" icon={mdiCheck} {disabled} />
    </div>
  {/if}

  {#if !noCancel && value != 0}
    <div class="line" />
    <Button --margin="0em" icon={mdiCancel} size="small" on:click={dispatchCancel} />
  {/if}
</form>

<style>
  form {
    display: flex;
    align-items: center;
    margin: 0.75rem 0;
  }

  .line {
    width: 0.5em;
    height: 2px;
    background: var(--inactive-color);
  }

  .button {
    all: unset;
    padding: 0.5em;
    margin: var(--margin, 0);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    width: fit-content;
    width: -webkit-fill-available;
    cursor: pointer;
    font-size: var(--font-size, 1em);
    transition: 1s box-shadow;
    user-select: none;
  }

  .disabled {
    color: #ccc;
    cursor: not-allowed;
  }
</style>
