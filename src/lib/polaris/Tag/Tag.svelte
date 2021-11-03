<script lang="ts">
  import { vg_trans } from "$lib/utils/trans-helper";
  import { createEventDispatcher } from "svelte";

  export let text;
  export let removable = true;

  const dispatch = createEventDispatcher();

  function remove() {
    dispatch("remove");
  }
</script>

<div class="Polaris-Stack__Item">
  <span class="Polaris-Tag" class:Polaris-Tag--removable={removable}>
    <span title="{text}" class="Polaris-Tag__TagText">{text}</span>
    {#if removable}
      <button type="button"
              aria-label="{vg_trans('Remove')} {text}"
              class="Polaris-Tag__Button"
              on:click={remove}
      >
        <span class="Polaris-Icon">
          <i class="material-icons">close</i>
        </span>
      </button>
    {/if}
  </span>
</div>
