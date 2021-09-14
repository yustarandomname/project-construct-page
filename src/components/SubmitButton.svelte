<script lang="ts">
  import Icon from "./Icon.svelte";
  export let icon: string = "";
  export let disabled: boolean = false;
</script>

<button type="submit" {disabled}>
  {#if icon}
    <Icon path={icon} />
  {/if}
  <slot />
</button>

<style>
  button {
    all: unset;
    margin: var(--margin, 0);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    width: fit-content;
    cursor: pointer;
    font-size: var(--font-size, 1em);
    transition: 1s box-shadow;
    user-select: none;
    border-radius: 50%;
    padding: 0.2em;
    line-height: 0;
  }

  button:hover {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
</style>
