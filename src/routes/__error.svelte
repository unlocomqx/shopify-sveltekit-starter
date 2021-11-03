<script context="module">
  export function load(data) {
    return {
      props: {
        error: `${data.status}: ${data.error.message}`,
      },
    };
  }
</script>

<script lang="ts">
  import Banner from "$lib/polaris/Banner/Banner.svelte";
  import { vg_trans } from "$lib/utils/trans-helper";
  import Button from "$lib/polaris/Button/Button.svelte";

  export let error;
</script>

<Banner title="{vg_trans('Error')}" message="{error}" type="critical">
  <svelte:fragment slot="actions">
    <Button href="/" icon="home">Return to the main page</Button>
  </svelte:fragment>
</Banner>
