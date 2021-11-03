<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";

  // Optionally set default options here
  const options = {
    theme: {
      "--toastBackground": "#48BB78",
      "--toastProgressBackground": "transparent",
      "--toastWidth": "auto",
      "--toastMsgPadding": "1.3rem 1.5rem",
    },
    duration: 2000,
    intro: { x: 5 },
  };
</script>

<SvelteToast {options} />
