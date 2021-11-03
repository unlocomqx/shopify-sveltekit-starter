<script lang="ts">
  import type { TableDndOptions } from "$lib/actions/table-dnd";
  import { tableDnd } from "$lib/actions/table-dnd";

  export let title: string = null;
  export let tableDndOptions: TableDndOptions = null;
  let classes = "";
  export { classes as class };
  export let compact = false;

  let TableDndFn = () => {
    return;
  };

  if (tableDndOptions) {
    TableDndFn = tableDnd;
  }
</script>

{#if title}
  <div
    class="Polaris-Page-Header Polaris-Page-Header--isSingleRow Polaris-Page-Header--mobileView Polaris-Page-Header--noBreadcrumbs Polaris-Page-Header--mediumTitle">
    <div class="Polaris-Page-Header__Row">
      <div class="Polaris-Page-Header__TitleWrapper">
        <div>
          <div class="Polaris-Header-Title__TitleAndSubtitleWrapper">
            <h1 class="Polaris-Header-Title">{title}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
<div class="Polaris-DataTable">
  <table use:TableDndFn={tableDndOptions}
         on:dndinit
         on:reorder
         class="Polaris-DataTable__Table {classes}"
         class:Polaris-DataTable__Table--compact={compact}
         {...$$restProps}
  >
    <slot></slot>
  </table>
</div>

<style lang="scss" global>
  .Polaris-DataTable__Table--compact {
    .Polaris-DataTable__Cell {
      padding: 1rem .2rem;
    }
  }
</style>
