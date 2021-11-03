<script lang="ts">
  import { uniqid } from "$lib/utils/utils";
  import { vg_trans } from "$lib/utils/trans-helper";
  import { onMount } from "svelte";
  import { autoselect as autoSelectAction } from "@ProductConfig/utils/autoselect";
  import { noop } from "svelte/internal";

  export let name = null;
  export let type = "text";
  export let label = null;
  export let title = null;
  export let desc = null;
  export let placeholder = null;
  export let value = null;
  export let required = null;
  export let disabled = null;
  export let autofocus = null;
  export let tabindex = null;
  export let prefix = null;
  export let suffix = null;
  export let clearButton = false;
  let classes = "";
  export { classes as class };
  export let autoselect = false;

  let id = uniqid();

  export let input: HTMLInputElement;
  onMount(() => {
    if (autofocus) {
      input.focus();
    }
  });

  let autoSelectFn = autoselect ? autoSelectAction : noop;
</script>

<div>
  {#if label}
    <div class="Polaris-Labelled__LabelWrapper">
      <div class="Polaris-Label">
        <label id="{id}Label" for={id} class="Polaris-Label__Text">{label}</label>
      </div>
    </div>
  {/if}
  <div class="Polaris-Connected">
    <div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
      <div class="Polaris-TextField Polaris-TextField--hasValue"
           class:Polaris-TextField--disabled={disabled}
      >
        <div class="Polaris-TextField__Prefix flex">
          {#if prefix}
            {prefix}
          {:else}
            <slot name="prefix"></slot>
          {/if}
        </div>
        {#if type === "number"}
          <input {id}
                 bind:this={input}
                 {title}
                 type="number"
                 class="Polaris-TextField__Input {classes}"
                 class:Polaris-TextField__Input--suffixed={suffix}
                 aria-labelledby="{id}Label"
                 aria-describedby={desc ? `${id}HelpText`: null}
                 aria-invalid="false"
                 {required}
                 {disabled}
                 {tabindex}
                 {name}
                 {placeholder}
                 {...$$restProps}
                 bind:value
                 on:input
                 on:change
                 on:blur
                 on:focus
                 use:autoSelectFn
                 {...$$restProps}
          >
        {:else}
          <input {id}
                 bind:this={input}
                 {title}
                 type="text"
                 class="Polaris-TextField__Input {classes}"
                 class:Polaris-TextField__Input--suffixed={suffix}
                 aria-labelledby="{id}Label"
                 aria-describedby={desc ? `${id}HelpText`: null}
                 aria-invalid="false"
                 {required}
                 {disabled}
                 {tabindex}
                 {name}
                 {placeholder}
                 {...$$restProps}
                 bind:value
                 on:input
                 on:change
                 on:blur
                 on:focus
                 use:autoSelectFn
                 {...$$restProps}
          >
        {/if}
        <div class="Polaris-TextField__Suffix flex">
          {#if suffix}
            {suffix}
          {:else}
            <slot name="suffix"></slot>
          {/if}
        </div>
        {#if clearButton && value}
          <button on:click={() => value = ""} type="button" class="Polaris-TextField__ClearButton" tabindex="0">
            <span class="Polaris-VisuallyHidden">{vg_trans("clear")}</span>
            <span class="Polaris-Icon Polaris-Icon--colorBase Polaris-Icon--applyColor">
              <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                <path fill-rule="evenodd"
                      d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM7.707 6.293a1 1 0 0 0-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 1 0 1.414 1.414L10 11.414l2.293 2.293a1 1 0 1 0 1.414-1.414L11.414 10l2.293-2.293a1 1 0 0 0-1.414-1.414L10 8.586 7.707 6.293z"></path>
              </svg>
            </span>
          </button>
        {/if}
        <div class="Polaris-TextField__Backdrop"></div>
      </div>
    </div>
  </div>
  {#if desc}
    <div class="Polaris-Labelled__HelpText" id="{id}HelpText">
      <span>{desc}</span>
    </div>
  {/if}
</div>
