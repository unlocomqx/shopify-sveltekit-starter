<script>
  export let colspan = null;
  let classes = "";
  export { classes as class };
</script>

<td class="Polaris-DataTable__Cell {classes}" {colspan}>
  <slot></slot>
</td>
