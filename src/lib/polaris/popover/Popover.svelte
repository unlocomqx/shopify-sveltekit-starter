<script lang="ts">
  import type { Position } from "../types";
  import { tick } from "svelte";

  export let position: Position = { top: null, left: null };
  export let active = false;
  export let relative = false;

  let container: HTMLDivElement;

  export async function toggle(el: HTMLElement) {
    if (active) {
      active = false;
      return;
    }

    active = true;
    await tick();
    if (relative) {
      position = { top: null, left: null };
      return;
    }
    const listButton = el.closest(".Polaris-List-Button") || el;
    let rect = listButton.getBoundingClientRect();
    active = true;
    await tick();
    position = {
      top: rect.height,
      left: listButton.offsetLeft - (container.clientWidth - listButton.clientWidth),
    };
  }

  export function hide() {
    active = false;
  }

</script>

<svelte:body on:click={() => active = false} />

<div bind:this={container}
     class="Polaris-PositionedOverlay Polaris-Popover__PopoverOverlay"
     class:pos-relative={relative}
     class:Polaris-Popover__PopoverOverlay--open={active}
     class:hidden={!active}
     style="top: {position.top}px; left: {position.left}px;"
>
  <div class="Polaris-Popover" data-polaris-overlay="true">
    <div class="Polaris-Popover__FocusTracker" tabindex="0"></div>
    <div>
      <div class="Polaris-Popover__Wrapper">
        <div id="Polarispopover10" tabindex="-1" class="Polaris-Popover__Content">
          <div class="Polaris-Popover__Pane Polaris-Scrollable Polaris-Scrollable--vertical"
               data-polaris-scrollable="true">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="Polaris-Popover__FocusTracker" tabindex="0"></div>
  </div>
</div>

<style>
  .pos-relative {
    top: 100%;
    right: -.75rem;
  }
</style>
