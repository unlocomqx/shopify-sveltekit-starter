<script lang="ts">
  import { enhance as enhanceAction } from "$lib/utils/form";
  import type { FormEnhanceParams } from "@interfaces/form";

  export let action = "/";
  export let method = "post";
  export let title: string = null;
  export let enhance: FormEnhanceParams = null;
  export let form: HTMLFormElement;

  export function submit() {
    form.submit();
  }

  let enhanceFn = enhanceAction;
  if (!enhance) {
    enhanceFn = () => {
      return;
    };
  }

  function setSubmitter(form: HTMLFormElement) {
    let submitter: HTMLInputElement = form.querySelector("[name=submitter]");

    form.addEventListener("click", function(ev: MouseEvent) {
      const button: HTMLButtonElement = (ev.target as HTMLElement).closest("button[type=submit]");
      submitter.value = button?.name ?? "";
    });
  }
</script>

<div>
  {#if title}
    <div
      class="Polaris-Page-Header Polaris-Page-Header--isSingleRow Polaris-Page-Header--mobileView Polaris-Page-Header--noBreadcrumbs Polaris-Page-Header--mediumTitle">
      <div class="Polaris-Page-Header__Row">
        <div class="Polaris-Page-Header__TitleWrapper">
          <div>
            <div class="Polaris-Header-Title__TitleAndSubtitleWrapper">
              <h1 class="Polaris-Header-Title">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  <form bind:this={form} {action} use:enhanceFn={enhance} use:setSubmitter {method} on:submit>
    <input type="submit" aria-hidden="true" style="visibility: hidden" tabindex="-1" />
    <input type="hidden" name="submitter" value="" />
    <div class="Polaris-FormLayout my-7">
      <slot></slot>
    </div>
  </form>
</div>
