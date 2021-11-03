<script lang="ts">
  import Form from "$lib/polaris/Form/Form.svelte";
  import { Card, CardContent, CardFooter, CardHeader } from "$lib/polaris/Card";
  import { vg_trans } from "$lib/utils/trans-helper";
  import TextField from "$lib/polaris/TextField/TextField.svelte";
  import FormItem from "$lib/polaris/Form/FormItem.svelte";
  import InlineError from "$lib/polaris/Form/InlineError.svelte";
  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";
  import Button from "$lib/polaris/Button/Button.svelte";
  import ButtonGroup from "$lib/polaris/ButtonGroup/ButtonGroup.svelte";
  import ButtonGroupItem from "$lib/polaris/ButtonGroup/ButtonGroupItem.svelte";
  import { ResourcePicker } from "@shopify/app-bridge/actions/index.js";
  import { getApp } from "$lib/shopify/bridge";
  import { onMount, tick } from "svelte";
  import { submit } from "$lib/utils/form";
  import { productConfigsStore } from "$lib/stores/product-configs";
  import { trigger } from "$lib/utils/utils";
  import type { IResponseData } from "@interfaces/response";
  import { route } from "$lib/utils/route";
  import { goto } from "$app/navigation";
  import Banner from "$lib/polaris/Banner/Banner.svelte";
  import type { ProductConfig } from "@prisma/client";
  import type { Product } from "@shopify/app-bridge/actions/ResourcePicker";

  export let productConfig: ProductConfig;

  let existing: ProductConfig = null;
  let htmlForm: HTMLFormElement;

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: productConfig,
    validationSchema: yup.object().shape({
      id_product: yup.string().required(vg_trans("Please pick a product first")),
    }),
    onSubmit: async () => {
      existing = null;
      try {
        const res = await submit(htmlForm);
        const data: IResponseData<{ existing: ProductConfig, productConfigs: ProductConfig[] }> = await res.json();
        if (data.existing) {
          existing = data.existing;
        }
        if (data.productConfigs) {
          $productConfigsStore = data.productConfigs;
          goto(route(data.redirect));
        }
      } catch (e) {
        console.error(e);
      }
    },
  });

  let product: Product;
  let idProductInput: HTMLInputElement;
  let productPicker: ResourcePicker;

  async function applySelectedProduct(selectPayload) {
    existing = null;
    const products = selectPayload.selection;
    product = products?.[0];
    if (product) {
      $form.id_product = product?.id;
      $form.has_variants = !product?.hasOnlyDefaultVariant;
      await tick();
      trigger(idProductInput, "change");
    }
  }

  function createProductPicker() {
    productPicker = ResourcePicker.create(getApp(), {
      resourceType: ResourcePicker.ResourceType.Product,
      options: {
        selectMultiple: false,
        showVariants: false,
      },
    });

    return productPicker.subscribe(ResourcePicker.Action.SELECT, async (selectPayload) => {
      if (selectPayload.selection) {
        await applySelectedProduct(selectPayload);
      }
    });
  }

  function openPicker() {
    productPicker.dispatch(ResourcePicker.Action.OPEN);
  };

  onMount(() => {
    const unsub = createProductPicker();
    openPicker();
    return unsub;
  });

  if (Number(process.env.TEST)) {
    // shopify resource picker mock
    window.addEventListener("message", ev => {
      applySelectedProduct(ev.data);
    });
  }
</script>

<Form bind:form={htmlForm} action="/product-configs" on:submit={handleSubmit}>
  <Card>
    <CardHeader>{vg_trans("Add a product config")}</CardHeader>
    <CardContent>
      {#if productConfig.id}
        <input type="hidden" name="id" value={productConfig.id}>
      {/if}
      <input type="hidden" name="product_title" value="{product?.title}">
      <FormItem>
        <Button on:click={openPicker}
                icon="playlist_add_check"
                primary
                class="mb-7"
                data-cy="select-product"
        >
          {vg_trans("Select a product")}
        </Button>
        <input type="hidden"
               name="id_product"
               bind:this={idProductInput}
               bind:value={$form.id_product}
               on:change={handleChange}
        />
        <input type="hidden"
               name="has_variants"
               bind:value={$form.has_variants}
        />
        {#if existing}
          <Banner class="mb-7"
                  title="{vg_trans('Configuration exists')}"
                  message={vg_trans("This product configuration already exists")}
                  type="info"
          >
            <svelte:fragment slot="actions">
              <Button href="/product-config/{existing.id}" icon="settings">Open configuration</Button>
            </svelte:fragment>
          </Banner>
        {/if}
        <InlineError class="mb-7" msg={$errors.id_product} />
        {#if product?.title}
          <TextField disabled
                     label="{vg_trans('Selected product')}"
                     value="{product?.title}"
          />
        {/if}
      </FormItem>
    </CardContent>
    <CardFooter>
      <ButtonGroup>
        <ButtonGroupItem>
          <Button icon="arrow_back" href="{route('/')}">
            {vg_trans("Cancel")}
          </Button>
        </ButtonGroupItem>
        <ButtonGroupItem>
          <Button type="submit" name="save" icon="save" primary disabled={!$state.isValid}>
            {vg_trans("Save")}
          </Button>
        </ButtonGroupItem>
        <ButtonGroupItem>
          <Button type="submit" name="save_and_configure" icon="settings" primary disabled={!$state.isValid}>
            {vg_trans("Save and configure")}
          </Button>
        </ButtonGroupItem>
      </ButtonGroup>
    </CardFooter>
  </Card>
</Form>
