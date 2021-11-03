<script lang="ts">
  export let msg = null;

  let classes = "";

  export { classes as class };
</script>

{#if msg}
  <div class="Polaris-InlineError {classes}" data-cy="error">
    <div class="Polaris-InlineError__Icon">
      <span class="Polaris-Icon">
        <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
          <path
            d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM9 9a1 1 0 0 0 2 0V7a1 1 0 1 0-2 0v2zm0 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
        </svg>
      </span>
    </div>
    {msg}
  </div>
{/if}
