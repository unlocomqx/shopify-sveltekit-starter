<script lang="ts">
  import "../app.postcss";
  import "@scss/global/global.scss";
  import { setLoading } from "$lib/stores/ui";
  import { navigating } from "$app/stores";
  import { onDestroy } from "svelte";
  import { initAppBridge } from "$lib/shopify/bridge";
  import { browser } from "$app/env";

  if (browser) {
    try {
      if (!Number(process.env.TEST)) {
        initAppBridge();
      }
    } catch (e) {
      console.error(e);
    }
  }

  export let vars;

  const unsub = navigating.subscribe((data) => {
    setLoading(!!data);
  });

  onDestroy(unsub);
</script>

<div class="Polaris-Page">
  <div class="Polaris-Page__Content">
    <slot />
  </div>
</div>
