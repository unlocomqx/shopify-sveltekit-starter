<script lang="ts">
  import { fade } from "svelte/transition";
  import Spinner from "../Spinner/Spinner.svelte";
</script>

<div class="fixed z-above-modal right-20 top-14" transition:fade={{duration: 200}}>
  <Spinner></Spinner>
</div>
