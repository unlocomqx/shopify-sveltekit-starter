<script lang="ts">
  import Spinner from "../Spinner/Spinner.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { confirmCanceled } from "$lib/stores/confirm";
  import { ui_store } from "$lib/stores/ui";
  import { longpress as longpressAction } from "$lib/utils/longpress";
  import { noop } from "svelte/internal";

  export let href = null;
  export let target = null;
  export let title = null;
  export let primary = false;
  export let outline = false;
  export let plain = false;
  export let slim = false;
  export let square = false;
  export let name = null;
  export let type = "button";
  export let disabled = false;
  export let icon = null;
  export let iconOnly = false;
  export let showLoader = !!href;
  export let split = false;
  export let connected = false;
  export let longpress = false;

  let loading = false;

  let classes = "";
  export { classes as class };
  export let style = null;

  let button: HTMLButtonElement;

  export function focus() {
    button.focus();
  }

  if (showLoader) {
    ui_store.subscribe(state => {
      if (!state.loading) {
        loading = false;
      }
    });
  }

  const dispatch = createEventDispatcher();

  function handleClick(ev: MouseEvent) {
    const has_modifier = ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey;
    if (showLoader && !plain && !target && !has_modifier) {
      loading = true;
    }
    dispatch("click", ev);
  }

  onMount(() => {
    return confirmCanceled.subscribe(() => {
      loading = false;
    });
  });

  const longpressFn = longpress ? longpressAction : noop;
</script>

{#if href}
  <a class="Polaris-Button {classes}"
     {style}
     {href}
     {target}
     {title}
     bind:this={button}
     sveltekit:prefetch
     class:Polaris-Button--primary={primary}
     class:Polaris-Button--outline={outline}
     class:Polaris-Button--plain={plain}
     class:Polaris-Button--sizeSlim={slim}
     class:Polaris-Button--sizeSquare={square}
     class:Polaris-Button--loading={loading}
     class:Polaris-Button--ConnectedDisclosure={split}
     class:Polaris-Button__ConnectedDisclosure={connected}
     on:click={handleClick}
     data-polaris-unstyled="true"
     {...$$restProps}
  >
    <span class="Polaris-Button__Content">
      {#if loading}
        <span class="Polaris-Button__Spinner">
          <Spinner></Spinner>
        </span>
      {/if}
      {#if !iconOnly}
        <span class="Polaris-Button__Icon">
          {#if icon}
            <i class="material-icons">{icon}</i>
          {/if}
        </span>
        <span class="Polaris-Button__Text">
          <slot></slot>
        </span>
      {:else}
        <span class="Polaris-Button--iconOnly">
          {#if icon}
            <i class="material-icons">{icon}</i>
          {/if}
        </span>
      {/if}
    </span>
  </a>
{:else}
  <button class="Polaris-Button {classes}"
          {style}
          {name}
          {type}
          bind:this={button}
          class:Polaris-Button--primary={primary}
          class:Polaris-Button--outline={outline}
          class:Polaris-Button--plain={plain}
          class:Polaris-Button--sizeSlim={slim}
          class:Polaris-Button--sizeSquare={square}
          class:Polaris-Button--disabled={disabled}
          class:Polaris-Button--loading={loading}
          class:Polaris-Button--connectedDisclosure={split}
          class:Polaris-Button__ConnectedDisclosure={connected}
          {title}
          {disabled}
          on:click={handleClick}
          use:longpressFn
          on:longpress
          {...$$restProps}
  >
    <span class="Polaris-Button__Content" style="{loading ? 'color: transparent': ''}">
      {#if loading}
        <span class="Polaris-Button__Spinner">
          <Spinner></Spinner>
        </span>
      {/if}
      {#if !iconOnly}
        <span class="Polaris-Button__Icon">
          {#if icon}
            <i class="material-icons">{icon}</i>
          {/if}
        </span>
        <span class="Polaris-Button__Text">
          <slot></slot>
        </span>
      {:else}
        <span class="Polaris-Button--iconOnly">
          {#if icon}
            <i class="material-icons">{icon}</i>
          {/if}
        </span>
      {/if}
    </span>
  </button>
{/if}

<style lang="scss">
  .Polaris-Button--sizeSlim :global(i.material-icons) {
    font-size: 1.5rem;
  }

  .Polaris-Button--sizeSquare {
    width: 4rem;
  }

  .Polaris-Button--connectedDisclosure {
    margin-right: 0;
  }
</style>
