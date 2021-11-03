<script lang="ts">
  let classes = "";
  export { classes as class };
</script>

<th data-polaris-header-cell="true"
    class="Polaris-DataTable__Cell Polaris-DataTable__Cell--header {classes}"
    scope="col"
    {...$$restProps}
>
  <slot></slot>
</th>
