<script lang="ts">
  import Icon from "../Button/Icon.svelte";
  import { dismissed } from "$lib/stores/dismissed";

  export let id;
  export let title;
  export let message;
  export let type: "default" | "success" | "info" | "warning" | "critical" = "default";
  let classes = "";
  export { classes as class };

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (!$dismissed) {
    dismissed.set({});
  }

  let is_dismissed = false;
  if (id) {
    if (typeof $dismissed[id] === "undefined") {
      $dismissed[id] = false;
    }

    is_dismissed = $dismissed[id];
  }

  let displayed = !is_dismissed;

  function dismissBanner() {
    displayed = false;
    if (id) {
      $dismissed[id] = true;
    }
  }
</script>

{#if displayed}
  <div data-cy="banner-{type}"
       class="Polaris-Banner Polaris-Banner--status{capitalizeFirstLetter(type)} Polaris-Banner--hasDismiss Polaris-Banner--withinPage {classes}"
       tabindex="0" role="status"
       aria-live="polite" aria-labelledby="PolarisBanner12Heading" aria-describedby="PolarisBanner12Content">
    <div class="Polaris-Banner__Dismiss">
      <Icon icon="close" on:click={dismissBanner} />
    </div>
    {#if type === "default"}
      <div class="Polaris-Banner__Ribbon">
        <span class="Polaris-Icon Polaris-Icon--colorBase Polaris-Icon--applyColor">
          <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
            <path fill-rule="evenodd"
                  d="M10 20c5.514 0 10-4.486 10-10S15.514 0 10 0 0 4.486 0 10s4.486 10 10 10zm1-6a1 1 0 1 1-2 0v-4a1 1 0 1 1 2 0v4zm-1-9a1 1 0 1 0 0 2 1 1 0 0 0 0-2z">
            </path>
          </svg>
        </span>
      </div>
    {:else if type === "success"}
      <div class="Polaris-Banner__Ribbon">
        <span class="Polaris-Icon Polaris-Icon--colorSuccess Polaris-Icon--applyColor">
          <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
            <path fill-rule="evenodd"
                  d="M0 10a10 10 0 1 0 20 0 10 10 0 0 0-20 0zm15.2-1.8a1 1 0 0 0-1.4-1.4L9 11.6 6.7 9.3a1 1 0 0 0-1.4 1.4l3 3c.4.4 1 .4 1.4 0l5.5-5.5z">
            </path>
          </svg>
        </span>
      </div>
    {:else if type === "info"}
      <div class="Polaris-Banner__Ribbon">
        <span class="Polaris-Icon Polaris-Icon--colorHighlight Polaris-Icon--applyColor">
          <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
            <path fill-rule="evenodd"
                  d="M10 20c5.514 0 10-4.486 10-10S15.514 0 10 0 0 4.486 0 10s4.486 10 10 10zm1-6a1 1 0 1 1-2 0v-4a1 1 0 1 1 2 0v4zm-1-9a1 1 0 1 0 0 2 1 1 0 0 0 0-2z">
            </path>
          </svg>
        </span>
      </div>
    {:else if type === "warning"}
      <div class="Polaris-Banner__Ribbon">
        <span class="Polaris-Icon Polaris-Icon--colorWarning Polaris-Icon--applyColor">
          <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
            <path fill-rule="evenodd"
                  d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6zm1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z">
            </path>
          </svg>
        </span>
      </div>
    {:else if type === "critical"}
      <div class="Polaris-Banner__Ribbon">
        <span class="Polaris-Icon Polaris-Icon--colorCritical Polaris-Icon--applyColor">
          <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
            <path
              d="M11.768.768a2.5 2.5 0 0 0-3.536 0L.768 8.232a2.5 2.5 0 0 0 0 3.536l7.464 7.464a2.5 2.5 0 0 0 3.536 0l7.464-7.464a2.5 2.5 0 0 0 0-3.536L11.768.768zM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6zm2 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z">
            </path>
          </svg>
        </span>
      </div>
    {/if}
    <div class="Polaris-Banner__ContentWrapper">
      {#if title}
        <div class="Polaris-Banner__Heading" id="PolarisBanner12Heading">
          <p class="Polaris-Heading">{title}</p>
        </div>
      {/if}
      <div class="Polaris-Banner__Content" id="PolarisBanner12Content">
        {#if message}
          <p>{message}</p>
          {:else}
          <slot></slot>
        {/if}
        <div class="Polaris-Banner__Actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .Polaris-Banner__Actions:empty {
    display: none;
  }
</style>
