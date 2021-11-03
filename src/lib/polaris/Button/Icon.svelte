<script lang="ts">
  import { ui_store } from "$lib/stores/ui";
  import { createEventDispatcher } from "svelte";
  import Spinner from "../Spinner/Spinner.svelte";

  export let icon;
  let classes = "";
  export { classes as class };
  export let showLoader = false;

  let loading = false;

  if (showLoader) {
    ui_store.subscribe(state => {
      if (!state.loading) {
        loading = false;
      }
    });
  }

  const dispatch = createEventDispatcher();

  function handleClick(ev) {
    if (showLoader) {
      loading = true;
    }
    dispatch("click", ev);
  }
</script>


<button
  class="Polaris-Button Polaris-Button--plain Polaris-Button--removeUnderline Polaris-Button--iconOnly {classes}"
  class:Polaris-Button--loading={loading}
  on:click={handleClick}
  {...$$restProps}
>
  <span class="Polaris-Button__Content">
    {#if loading}
      <span class="Polaris-Button__Spinner">
        <Spinner></Spinner>
      </span>
    {/if}
    <span class="Polaris-Button__Icon">
      <span class="Polaris-Icon">
        <i class="material-icons">{icon}</i>
      </span>
    </span>
  </span>
</button>

<style>
  .Polaris-Button {
    padding: 0;
  }

  .Polaris-Button__Icon {
    padding: .5rem;
  }

  .Polaris-Button--loading i {
    color: transparent;
  }
</style>
