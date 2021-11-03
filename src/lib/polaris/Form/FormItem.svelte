<script lang="ts">
  let classes = "";
  export { classes as class };
</script>

<div class="Polaris-FormLayout__Item {classes}">
  <slot></slot>
</div>

<style>
  .Polaris-FormLayout__Item {
    margin-right: 2rem;
  }
</style>
