<script lang="ts">
  import Icon from "./Icon.svelte";

  export let state: "default" | "active" | "destructive" = "default";
  export let size: "small" | "medium" | "large" = "medium";
  export let icon: string = "";
</script>

<div
  class="button"
  class:active={state == "active"}
  class:destructive={state == "destructive"}
  class:small={size == "small"}
  class:large={size == "large"}
  on:click
>
  {#if icon}
    <Icon path={icon} />
  {/if}

  <slot />
</div>

<style>
  .button {
    padding: 0.5em;
    margin: var(--margin, 0);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    width: fit-content;
    cursor: pointer;
    font-size: var(--font-size, 1em);
    transition: 1s box-shadow;
    user-select: none;
  }

  .small {
    border-radius: 50%;
    padding: 0.2em;
    line-height: 0;
  }

  .large {
    width: 100%;
    padding: 0.75em;
  }

  .active {
    background: var(--active-color);
  }

  .destructive {
    background: var(--destructive-color);
  }

  .button:hover {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
</style>
