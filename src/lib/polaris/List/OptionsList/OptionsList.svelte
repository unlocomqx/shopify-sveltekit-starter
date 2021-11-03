<script lang="ts">
  import type { ListItem } from "$lib/polaris/types";
  import Item from "./Item.svelte";
  import { createEventDispatcher } from "svelte";

  export let title = null;
  export let options: ListItem[] = [];

  let selected;
  const dispatch = createEventDispatcher();

  function handleSelected(ev: CustomEvent<{ option: ListItem }>) {
    const option = ev.detail.option;
    selected = option;
    dispatch("change", { selected });
  }
</script>

<div>
  <div class="Polaris-Card">
    <ul class="Polaris-OptionList">
      <li>
        {#if title}
          <p class="Polaris-OptionList__Title">{title}</p>
        {/if}
        <ul class="Polaris-OptionList__Options">
          {#each options as option (option.value)}
            <Item {option} bind:selected on:selected={handleSelected}></Item>
          {/each}
        </ul>
      </li>
    </ul>
  </div>
</div>
