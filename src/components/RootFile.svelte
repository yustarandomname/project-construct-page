<script>
  import { mdiPlus } from "@mdi/js";
  import Button from "./Button.svelte";
  export let name = "Home";
</script>

{#if !!Object.keys($$slots).length}
  <div class="attach-below">
    <Button state="active">{name}</Button>

    <div class="content">
      <div class="line" />
      <div class="pages">
        <slot />
      </div>
    </div>
    <Button size="small" icon={mdiPlus} --margin="0 0.35em" />
  </div>
{:else}
  <div class="attach-right">
    <Button state="active">{name}</Button>

    <div class="line" />
    <Button size="small" icon={mdiPlus} />
  </div>
{/if}

<style>
  /* with Props */
  .attach-below .content {
    display: flex;
  }

  .attach-below .line {
    height: auto;
    margin: 0 0 0 1em;
    width: 2px;
    background: var(--inactive-color);
  }

  /* No Props */
  .attach-right {
    display: flex;
    align-items: center;
  }

  .attach-right > .line {
    height: 2px;
    width: 0.5em;
    background: var(--inactive-color);
  }
</style>
