<script lang="ts">
  import { mdiCancel, mdiCheck } from "@mdi/js";
  import { createEventDispatcher } from "svelte";
  import Button from "../components/Button.svelte";
  import SubmitButton from "../components/SubmitButton.svelte";

  export let value = "";
  export let disabled = false;
  export let prependLine = false;
  export let placeholder = "";
  export let size: "large" | "medium" = "large";
  export let noCancel = false;

  const dispatch = createEventDispatcher();
  let valueIsChanged = false;

  function dispatchCancel() {
    dispatch("cancel");
  }

  function dispatchSubmit() {
    dispatch("submit");
    valueIsChanged = false;
  }
</script>

<form on:submit|preventDefault>
  {#if prependLine}
    <div class="line" />
  {/if}

  <input type="text" class:large={size == "large"} bind:value on:input={() => (valueIsChanged = true)} {disabled} {placeholder} />

  {#if valueIsChanged}
    <div class="line" />
    <div on:click={dispatchSubmit}>
      <SubmitButton icon={mdiCheck} {disabled} />
    </div>
  {/if}

  {#if !noCancel}
    <div class="line" />
    <Button icon={mdiCancel} size="small" on:click={dispatchCancel} />
  {/if}
</form>

<style>
  form {
    display: flex;
    align-items: center;
    margin: 0.75rem 0;
  }

  input[type="text"] {
    all: unset;
    padding: 0.5em;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    flex-grow: 1;
    cursor: pointer;
    font-size: var(--font-size, 1em);
    transition: 1s box-shadow;
  }

  .large {
    width: 100%;
  }

  .line {
    width: 0.5em;
    height: 2px;
    background: var(--inactive-color);
  }
</style>
