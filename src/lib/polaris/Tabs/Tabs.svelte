<script lang="ts">
  import type { Tab } from "../types";
  import { onMount } from "svelte";
  import { vg_trans } from "$lib/utils/trans-helper";
  import Popover from "../popover/Popover.svelte";
  import ActionList from "../List/ActionList.svelte";
  import debounce from "lodash.debounce";
  import Spinner from "../Spinner/Spinner.svelte";
  import { currentTab } from "$lib/stores/current-tab";

  export let tabs: Tab[];

  let selectedTab: Tab;
  $: {
    selectedTab = tabs.find(tab => tab.id === $currentTab);
    if (!selectedTab?.active) {
      selectedTab = tabs.find(tab => tab.active);
    }
  }

  function activateTab(tab: Tab) {
    if (tab === selectedTab) {
      return;
    }
    selectedTab = tab;
    $currentTab = tab.id;
  }

  async function loadTab(tab: Tab, preload_next = true) {
    const result = await import(`../../product-config/tabs/${tab.component}.svelte`);
    if (preload_next) {
      preloadNextTab(tab);
    }
    return result;
  }

  async function preloadNextTab(tab: Tab) {
    const idx = tabs.findIndex(t => t.id === tab.id);
    const next = tabs.find((t, index) => index > idx && t.active);
    if (next) {
      await loadTab(next, false);
    }
  }

  let tabsContainer: HTMLDivElement;
  let rightMargin = 40;
  let hiddenTabs = [];

  function isHidden(el: HTMLElement, xLimit) {
    let rect = el.getBoundingClientRect();
    return rect.right > xLimit;
  }

  function getHiddenTabs() {
    const rect = tabsContainer.getBoundingClientRect();
    const xLimit = rect.right - rightMargin;
    hiddenTabs = tabs.filter(tab => tab.active)
      .map(tab => [tab, tabsContainer.querySelector(`#dp-tab-${tab.id}`)])
      .map(([tab, el]) => [tab, isHidden(el, xLimit)])
      .filter(([, visible]) => visible)
      .map(([tab]) => tab);
  }

  const debouncedGetHiddenTabs = debounce(getHiddenTabs, 500);

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      debouncedGetHiddenTabs(entry.contentRect);
    }
  });

  onMount(() => {
    resizeObserver.observe(tabsContainer);

    return () => {
      resizeObserver.unobserve(tabsContainer);
    };
  });


  let togglePopover: (el: HTMLElement) => void;
  let popoverActive = false;
</script>

<div>
  <div class="Polaris-Card">
    <div>
      <div class="Polaris-Tabs__Wrapper">
        <ul role="tablist" class="Polaris-Tabs" bind:this={tabsContainer}>
          {#each tabs as tab}
            {#if tab.active}
              <li class="Polaris-Tabs__TabContainer"
                  class:Polaris-Tabs__HiddenTab={hiddenTabs.includes(tab)}
                  role="presentation">
                <button id="dp-tab-{tab.id}"
                        role="tab"
                        type="button"
                        tabindex="-1"
                        class="Polaris-Tabs__Tab"
                        class:Polaris-Tabs__Tab--selected={selectedTab.id === tab.id}
                        aria-selected="true"
                        on:click={() => activateTab(tab)}
                        data-cy="tab-{tab.id}"
                >
                  <span class="Polaris-Tabs__Title">
                    {#if tab.icon}
                      <span>
                        <i class="material-icons">{tab.icon}</i>
                      </span>
                    {/if}
                    <span class:ml-1={tab.icon}>{tab.title}</span>
                  </span>
                </button>
              </li>
            {/if}
          {/each}
        </ul>
        {#if hiddenTabs.length}
          <div on:click|stopPropagation>
            <button on:click|stopPropagation={(ev) => togglePopover(ev.target)}
                    type="button"
                    class="Polaris-Tabs__DisclosureActivator Polaris-More-Tabs Polaris-List-Button"
                    aria-label="{vg_trans('More tabs')}">
              <span class="Polaris-Tabs__Title">
                <span class="Polaris-Icon Polaris-Icon--colorSubdued Polaris-Icon--applyColor">
                  <i class="material-icons">more_horiz</i>
                </span>
              </span>
            </button>
            <Popover bind:active={popoverActive} bind:toggle={togglePopover}>
              <ActionList>
                {#each hiddenTabs as tab}
                  <li>
                    <button id="dp-tab-{tab.id}"
                            on:click={() => activateTab(tab)}
                            type="button"
                            class="Polaris-ActionList__Item">
                      <span class="Polaris-ActionList__Content">
                        <span class="Polaris-ActionList__Text">{tab.title}</span>
                      </span>
                    </button>
                  </li>
                {/each}
              </ActionList>
            </Popover>
          </div>
        {/if}
      </div>
      <div class="Polaris-Tabs__Panel"
           id="dp-tab-content-{selectedTab.id}"
           role="tabpanel"
           aria-labelledby="dp-tab-{selectedTab.id}"
           tabindex="-1"
           data-cy="tab-content-{selectedTab.id}"
      >
        <div class="Polaris-Card__Section">
          {#await loadTab(selectedTab)}
            {#key selectedTab}
              <Spinner delay="500" />
            {/key}
          {:then { default: component }}
            <svelte:component this={component} />
          {/await}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .Polaris-Tabs__Wrapper {
    position: relative;
  }

  .Polaris-Tabs {
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .Polaris-Tabs__Title {
    display: flex;
    align-items: center;
    justify-items: center;
  }

  .Polaris-Tabs__TabContainer {
    opacity: 1;
    transition: opacity ease-in-out .2s;
  }

  .Polaris-Tabs__HiddenTab {
    opacity: 0;
  }

  .Polaris-More-Tabs {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--p-surface);
  }

  i.material-icons {
    color: var(--p-icon-subdued);
  }
</style>
