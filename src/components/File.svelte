<script>
  import { mdiPlus } from "@mdi/js";
  import Button from "./Button.svelte";

  export let name = "/";
  export let hasPermission = false;

  let isOpen = false;
</script>

<div class="file attach-left">
  <div class="line" class:hasPermission />

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
  }

  .attach-right {
    align-items: center;
  }

  .attach-right > .line,
  .attach-left > .line {
    height: 2px;
    width: 0.5em;
    background: var(--inactive-color);
  }

  .attach-left > .line {
    margin-top: 1em;
  }

  /* Long line */
  .attach-below .content {
    display: flex;
  }

  .attach-below > .content > .line {
    height: auto;
    margin: 0 0 0 1em;
    width: 2px;
    background: var(--inactive-color);
  }

  /* Has Permission */
  .hasPermission.line {
    background: var(--destructive-color);
  }
</style>
