<script>
  let classes = "";
  export { classes as class };
</script>

<tr data-id="{$$props['data-id']}"
    class="Polaris-DataTable__TableRow {classes}"
    {...$$restProps}
>
  <slot></slot>
</tr>
