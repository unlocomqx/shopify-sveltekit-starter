<script lang="ts">
  export let active = true;
</script>

<div class="inline-flex items-center" class:Polaris-Button__ConnectedDisclosureWrapper={active}>
  <slot></slot>
</div>
