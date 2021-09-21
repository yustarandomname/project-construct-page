<script lang="ts">
  import { mdiLoading } from "@mdi/js";
  import Icon from "./Icon.svelte";
  export let icon: string = "";
  export let disabled: boolean = false;
  export let large = false;
  export let loading = false;
</script>

<button type="submit" class:large disabled={disabled || loading}>
  {#if icon}
    <Icon path={icon} />
  {/if}
  <slot />
  {#if loading}
    <Icon spin={true} path={mdiLoading} />
  {/if}
</button>

<style>
  button {
    all: unset;
    padding: var(--margin, 0.2em);
    margin: var(--padding, 0);
    background: var(--background, transparent);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    width: fit-content;
    cursor: pointer;
    font-size: var(--font-size, 1em);
    transition: 1s box-shadow;
    user-select: none;
    border-radius: 50%;
    line-height: 0;
  }

  button.large {
    line-height: inherit;
    border-radius: 0.2em;
    padding: var(--padding, 0.5em);
  }

  button:hover {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  button[disabled="true"] {
    background: transparent;
    box-shadow: none;
    color: var(--inactive-color);
  }
</style>
