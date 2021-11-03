<script lang="ts">
  import { dpa_ui } from "@ProductConfig/variables";
  import Icon from "../Button/Icon.svelte";
  import { uniqid } from "@utils/utils";

  export let open = false;
  let classes = "";
  export { classes as class };
  export let size = "large";

  function closeModal() {
    $dpa_ui.open_modal = null;
  }

  function handleKeyup(ev: KeyboardEvent) {
    if (ev.key == "Escape") {
      closeModal();
    }
  }

  const id = uniqid();
</script>

{#if open}
  <div class="Polaris-Modal-Dialog__Container {classes}"
       on:keyup={handleKeyup}
       on:mousedown={closeModal}
       {...$$restProps}
  >
    <div role="dialog"
         aria-modal="true"
         aria-labelledby="{id}"
         tabindex="-1"
         class="Polaris-Modal-Dialog"
    >
      <div class="Polaris-Modal-Dialog__Modal Polaris-Modal-Dialog__Modal--{size}" on:mousedown|stopPropagation>
        <div class="Polaris-Modal-Header">
          <div {id} class="Polaris-Modal-Header__Title">
            <h2 class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">
              <slot name="header"></slot>
            </h2>
          </div>
          <Icon on:click={closeModal} icon="close" data-cy="close"></Icon>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
  <div class="Polaris-Backdrop" on:click={closeModal}></div>
{/if}

<style>
  :global(.Polaris-Modal-Header i.material-icons) {
    display: inline-block;
    vertical-align: sub;
  }

  @media (min-width: 48.0625em) {
    :global(.Polaris-Modal-Dialog__Modal--large) {
      max-width: 80rem;
    }

    :global(.Polaris-Modal-Dialog__Modal--medium) {
      max-width: 60rem;
    }
  }

</style>
