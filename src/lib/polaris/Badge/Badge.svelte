<script lang="ts">
  let classes = "";
  export { classes as class };

  export let title;
</script>

<span class="Polaris-Badge {classes}" {title} on:click {...$$restProps}>
  <slot></slot>
</span>
