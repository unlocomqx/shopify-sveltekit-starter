<script lang="ts">
  export let title: string;
  export let desc: string = null;
</script>

<div>
  <div class="Polaris-Card">
    <div class="Polaris-Card__Section">
      <div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
        <div class="Polaris-EmptyState__Section">
          <div class="Polaris-EmptyState__DetailsContainer">
            <div class="Polaris-EmptyState__Details">
              <div class="Polaris-TextContainer">
                <p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">
                  {title}
                </p>
                {#if desc}
                  <div class="Polaris-EmptyState__Content">
                    <p>{desc}</p>
                  </div>
                {/if}
              </div>
              <div class="Polaris-EmptyState__Actions">
                <div
                  class="Polaris-Stack Polaris-Stack--spacingTight Polaris-Stack--distributionCenter Polaris-Stack--alignmentCenter">
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="PolarisPortalsContainer"></div>
</div>
