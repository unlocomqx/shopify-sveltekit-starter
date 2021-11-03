<script>
  let classes = "";
  export { classes as class };
</script>

<div class="Polaris-Modal__BodyWrapper {classes}">
  <div class="Polaris-Modal__Body Polaris-Scrollable Polaris-Scrollable--vertical"
       data-polaris-scrollable="true">
    <slot></slot>
  </div>
</div>
