<script lang="ts">
  import Form from "$lib/polaris/Form/Form.svelte";
  import { Card, CardContent, CardFooter, CardHeader } from "$lib/polaris/Card";
  import { vg_trans } from "$lib/utils/trans-helper";
  import TextField from "$lib/polaris/TextField/TextField.svelte";
  import FormItem from "$lib/polaris/Form/FormItem.svelte";
  import Checkbox from "$lib/polaris/Checkbox/Checkbox.svelte";
  import type { IUnit } from "@interfaces/unit";
  import InlineError from "$lib/polaris/Form/InlineError.svelte";
  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";
  import Button from "$lib/polaris/Button/Button.svelte";
  import ButtonGroup from "$lib/polaris/ButtonGroup/ButtonGroup.svelte";
  import ButtonGroupItem from "$lib/polaris/ButtonGroup/ButtonGroupItem.svelte";
  import { submit } from "$lib/utils/form";
  import { route } from "$lib/utils/route";
  import LangInput from "@ProductConfig/components/LangInput.svelte";
  import type { IResponse } from "@interfaces/response";
  import { error } from "@ProductConfig/utils/message";
  import { goto } from "$app/navigation";

  export let unit: IUnit;

  let htmlForm: HTMLFormElement;

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: unit,
    validationSchema: yup.object().shape({
      name: yup.string().required().label("Name"),
      symbol: yup.string().required().label("Symbol"),
    }),
    onSubmit: async () => {
      try {
        const res = await submit(htmlForm);
        const data: IResponse = await res.json();
        if (data.success) {
          goto(route("/"));
        } else {
          error(data.message);
        }
      } catch (e) {
        console.error(e);
      }
    },
  });
</script>

<Form bind:form={htmlForm} action="/units" on:submit={handleSubmit}>
  <Card>
    <CardHeader>{vg_trans("Add unit")}</CardHeader>
    <CardContent>
      {#if unit.id}
        <input type="hidden" name="id" value={unit.id}>
      {/if}
      <FormItem>
        <LangInput label="{vg_trans('Name')}"
                   desc="{vg_trans('Example: Meter, Centimeter, Inch...')}"
                   name="name"
                   bind:values={unit.lang}
                   bind:value="{$form.name}"
        />
        <InlineError msg={$errors.name} />
      </FormItem>
      <FormItem>
        <TextField name="symbol"
                   on:change={handleChange}
                   on:blur={handleChange}
                   label="{vg_trans('Symbol')}"
                   desc="{vg_trans('Example: m, cm, in...')}"
                   bind:value="{$form.symbol}"
        />
        <InlineError msg={$errors.symbol} />
      </FormItem>
      <FormItem>
        <Checkbox name="active"
                  label="{vg_trans('Active')}"
                  value="{unit.active}"
                  data-cy="active"
        />
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
          <Button type="submit"
                  icon="save"
                  primary
                  disabled={!$state.isValid}
                  data-cy="save"
          >
            {vg_trans("Save")}
          </Button>
        </ButtonGroupItem>
      </ButtonGroup>
    </CardFooter>
  </Card>
</Form>
