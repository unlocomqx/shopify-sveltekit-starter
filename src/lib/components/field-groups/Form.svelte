<script lang="ts">
  import Form from "$lib/polaris/Form/Form.svelte";
  import { Card, CardContent, CardFooter, CardHeader } from "$lib/polaris/Card";
  import { vg_trans } from "$lib/utils/trans-helper";
  import TextField from "$lib/polaris/TextField/TextField.svelte";
  import FormItem from "$lib/polaris/Form/FormItem.svelte";
  import Checkbox from "$lib/polaris/Checkbox/Checkbox.svelte";
  import InlineError from "$lib/polaris/Form/InlineError.svelte";
  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";
  import Button from "$lib/polaris/Button/Button.svelte";
  import ButtonGroup from "$lib/polaris/ButtonGroup/ButtonGroup.svelte";
  import ButtonGroupItem from "$lib/polaris/ButtonGroup/ButtonGroupItem.svelte";
  import { submit } from "$lib/utils/form";
  import { route } from "$lib/utils/route";
  import LangInput from "@ProductConfig/components/LangInput.svelte";
  import type { IFieldGroup } from "@interfaces/field-group";
  import type { IResponse } from "@interfaces/response";
  import { goto } from "$app/navigation";

  export let field_group: IFieldGroup;

  let htmlForm: HTMLFormElement;

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: field_group,
    validationSchema: yup.object().shape({
      label: yup.string().required().label("Label"),
    }),
    onSubmit: async () => {
      try {
        const res = await submit(htmlForm);
        const data: IResponse = await res.json();
        if (data.success) {
          goto(route("/"));
        }
      } catch (e) {
        console.error(e);
      }
    },
  });
</script>

<Form bind:form={htmlForm} action="/field-groups" on:submit={handleSubmit}>
  <Card>
    <CardHeader>{vg_trans("Add field group")}</CardHeader>
    <CardContent>
      {#if field_group.id}
        <input type="hidden" name="id" value={field_group.id}>
      {/if}
      <FormItem>
        <LangInput label="{vg_trans('Label')}"
                   desc="{vg_trans('Will be displayed to the customers')}"
                   name="label"
                   bind:values={field_group.lang}
                   bind:value="{$form.label}"
        />
        <InlineError msg={$errors.label} />
      </FormItem>
      <FormItem>
        <Checkbox name="show_label"
                  label="{vg_trans('Show label')}"
                  value="{field_group.show_label}"
                  data-cy="show-label"
        />
      </FormItem>
      <FormItem>
        <TextField name="name"
                   label="{vg_trans('Name')} ({vg_trans('Optional')})"
                   desc="{vg_trans('Only used to target the group using custom css code')}"
                   value="{field_group.name}"
        />
        <pre>
          {`.dp_group_[name] {
  /* style the group */
}`}
        </pre>
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
