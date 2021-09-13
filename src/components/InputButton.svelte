<script lang="ts">
  export let value = "";
  export let disabled = false;
</script>

<form on:submit|preventDefault>
  <div class="line" />
  <input type="text" bind:value {disabled} />
  <div class="line" />
  <input type="submit" {disabled} />
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
    width: fit-content;
    cursor: pointer;
    font-size: var(--font-size, 1em);
    transition: 1s box-shadow;
  }

  .line {
    width: 0.5em;
    height: 2px;
    background: var(--inactive-color);
  }
</style>
