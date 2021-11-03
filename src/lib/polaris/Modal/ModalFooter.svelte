<script>
  let classes = "";
  export { classes as class };
</script>

<div class="Polaris-Modal-Footer {classes}">
  <div class="Polaris-Modal-Footer__FooterContent">
    <div class="Polaris-Stack Polaris-Stack--alignmentCenter">
      <div class="Polaris-Stack__Item">
        <slot name="left"></slot>
      </div>
      <div class="Polaris-Stack__Item Polaris-Stack__Item--fill"></div>
      <div class="Polaris-Stack__Item">
        <slot></slot>
      </div>
    </div>
  </div>
</div>
