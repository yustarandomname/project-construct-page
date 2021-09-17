<script lang="ts">
  import Icon from "./Icon.svelte";

  export let state: "default" | "active" | "destructive" = "default";
  export let size: "small" | "medium" | "large" = "medium";
  export let icon: string = "";
  export let disabled: boolean = false;
  export let line: boolean = false;
</script>

<div class="buttonWrapper">
  {#if line}
    <div class="line" />
  {/if}

  <div class="button {state} {size}" class:disabled on:click>
    {#if icon}
      <Icon path={icon} />
    {/if}

    <slot />
  </div>
</div>

<style>
  .buttonWrapper {
    display: flex;
    align-items: center;
  }

  .line {
    height: 2px;
    width: 0.5em;
    background: var(--inactive-color);
  }

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

  .disabled {
    color: #ccc;
    cursor: not-allowed;
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

  .button:not(.disabled):hover {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
</style>
