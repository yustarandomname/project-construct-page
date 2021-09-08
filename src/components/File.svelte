<script>
  import { mdiPlus } from "@mdi/js";
  import Button from "./Button.svelte";
  export let name = "/";

  let isOpen = false;
</script>

<div class="file attach-left">
  <div class="line" />

  {#if !!Object.keys($$slots).length}
    <div class="attach-below">
      <Button state={isOpen ? "active" : ""} on:click={() => (isOpen = !isOpen)}>{name}</Button>

      {#if isOpen}
        <div class="content">
          <div class="line" />
          <div class="pages">
            <slot />
          </div>
        </div>
        <Button size="small" icon={mdiPlus} --margin="0 0.35em" />
      {/if}
    </div>
  {:else}
    <div class="attach-right">
      <Button state={isOpen ? "active" : ""} on:click={() => (isOpen = !isOpen)}>{name}</Button>

      <div class="line" />
      <Button size="small" icon={mdiPlus} />
    </div>
  {/if}
</div>

<style>
  /* Global */
  .file {
    margin: 0.75rem 0;
  }

  /* Start / End */
  .attach-left,
  .attach-right {
    display: flex;
    align-items: center;
  }

  .attach-right > .line,
  .attach-left > .line {
    height: 0.1em;
    width: 0.5em;
    background: var(--inactive-color);
  }

  /* Long line */
  .attach-below .content {
    display: flex;
  }

  .attach-below .line {
    height: auto;
    margin: 0 0 0 1em;
    width: 0.1em;
    background: var(--inactive-color);
  }
</style>
