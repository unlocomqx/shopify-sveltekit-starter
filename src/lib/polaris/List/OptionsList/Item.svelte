<script lang="ts">
  import type { ListItem } from "$lib/polaris/types";
  import { uniqid } from "@utils/utils";
  import { createEventDispatcher } from "svelte";

  export let selected: string;
  export let option: ListItem;

  const id = uniqid();

  let focused = false;

  const dispatch = createEventDispatcher();

  function select(option) {
    dispatch("selected", { option });
  }
</script>

<li class="Polaris-OptionList-Option" tabindex="-1">
  <button type="button"
          on:click={() => select(option)}
          id="{id}-{option.value}"
          class="Polaris-OptionList-Option__SingleSelectOption"
          class:Polaris-OptionList-Option--select={selected === option.value}
          on:focus={() => focused = true}
          on:blur={() => focused = false}
          class:Polaris-OptionList-Option--focused={focused}
  >
    {option.text}
  </button>
</li>
