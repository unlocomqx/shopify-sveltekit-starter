<script lang="ts">
  import type { SelectItem } from "../types";
  import { isNumeric, uniqid } from "$lib/utils/utils";
  import { createEventDispatcher, onMount } from "svelte";

  export let name = null;
  export let label = null;
  export let value = null;

  // used for reactivity
  export let options;

  let classes = "";
  export { classes as class };

  let id = uniqid();

  let select: HTMLSelectElement;
  let selectedOption: SelectItem;

  function syncSelectedOption() {
    selectedOption = select?.selectedOptions?.[0];
  }

  function setInitialValue() {
    value = select.selectedOptions?.[0]?.value;
    value = castValue(value);
  }

  function castValue(value) {
    if (!value) {
      value = null;
    }
    if (isNumeric(value)) {
      value = Number(value);
    }

    return value;
  }

  onMount(() => {
    syncSelectedOption();
    setInitialValue();
  });

  function handleChange() {
    syncSelectedOption();
  }


  const dispatch = createEventDispatcher();

  function handleBlur(ev) {
    value = castValue(value);
    dispatch("blur", ev);
  }

  $: {
    options;
    syncSelectedOption();
  }
</script>

<div class="{classes}">
  <div>
    {#if label}
      <div class="Polaris-Labelled__LabelWrapper">
        <div class="Polaris-Label">
          <label id="{id}Label" for="{id}" class="Polaris-Label__Text">
            {label}
          </label>
        </div>
      </div>
    {/if}
    <div class="Polaris-Select">
      <select {id}
              {name}
              class="Polaris-Select__Input"
              aria-invalid="false"
              on:change={handleChange}
              on:blur={handleBlur}
              bind:value
              bind:this={select}
              {...$$restProps}
      >
        <slot></slot>
      </select>
      <div class="Polaris-Select__Content" aria-hidden="true">
        <span class="Polaris-Select__SelectedOption">{selectedOption?.label ?? ''}</span>
        <span class="Polaris-Select__Icon">
          <span class="Polaris-Icon">
            <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
              <path d="M10 16l-4-4h8l-4 4zm0-12l4 4H6l4-4z"></path>
            </svg>
          </span>
        </span>
      </div>
      <div class="Polaris-Select__Backdrop"></div>
    </div>
  </div>
  <div id="PolarisPortalsContainer"></div>
</div>

<style>
  .Polaris-Label__Text {
    white-space: nowrap;
  }
</style>
