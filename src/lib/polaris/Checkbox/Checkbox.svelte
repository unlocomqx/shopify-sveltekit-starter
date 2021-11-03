<script lang="ts">

  import { createEventDispatcher } from "svelte";
  import { uniqid } from "$lib/utils/utils";

  const dispatch = createEventDispatcher();

  export let name = null;
  export let value: boolean | number;
  export let label;
  export let title = null;
  export let desc = null;

  let id = uniqid();

  function changed(ev) {
    value = ev.target.checked;
    dispatch("change", { name, value });
  }

  let focused = false;
</script>

<div class="my-4">
  <label class="Polaris-Choice" for={id} {title} {...$$restProps}>
    <span class="Polaris-Choice__Control">
      <span class="Polaris-Checkbox">
        <input {id}
               {name}
               on:change={changed}
               type="checkbox"
               class="Polaris-Checkbox__Input"
               class:Polaris-Checkbox--keyFocused={focused}
               on:focus={() => focused = true}
               on:blur={() => focused = false}
               aria-invalid="false"
               role="checkbox"
               aria-checked={!!value}
               checked={!!value}
               value={value ? 1 : 0}
        />
        <span class="Polaris-Checkbox__Backdrop"></span>
        <span class="Polaris-Checkbox__Icon">
          <span class="Polaris-Icon">
            <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
              <path
                d="M8.315 13.859l-3.182-3.417a.506.506 0 0 1 0-.684l.643-.683a.437.437 0 0 1 .642 0l2.22 2.393 4.942-5.327a.436.436 0 0 1 .643 0l.643.684a.504.504 0 0 1 0 .683l-5.91 6.35a.437.437 0 0 1-.642 0"></path>
            </svg>
          </span>
        </span>
      </span>
    </span>
    <span class="Polaris-Choice__Label">{label}</span>
  </label>
  {#if desc}
    <div class="text-xl text-gray-600 pl-11">{desc}</div>
  {/if}
</div>
