<script lang="ts">
  import {
    FormGroup,
    TextInput,
    Select,
    SelectItem,
    TextArea,
    Button,
  } from 'carbon-components-svelte';
  import { createForm } from 'svelte-forms-lib';
  import {
    MixSharedService,
    Culture,
    SUPPORTED_DATABASE,
    InitTenantModel,
  } from '@mix.core/mix.lib';
  import { environment } from '../environments/environment';
  import type { ISelectOption } from '../models/select-option.model';
  import { createEventDispatcher } from 'svelte';
  import { ArrowRight16 } from 'carbon-icons-svelte';
  import { showGlobalToastNotification } from '../stores/toast/toast.store';
  import { MixApi } from '../helpers/https.helper';

  const dispatch = createEventDispatcher();
  const createSiteSubmitEvent = 'onCreateSiteSubmit';

  let availableCutures: Culture[] = [];
  let availableDatabases: ISelectOption[] = [
    // {
    //   value: SUPPORTED_DATABASE.SqlServer.value,
    //   label: SUPPORTED_DATABASE.SqlServer.label,
    // },
    {
      value: SUPPORTED_DATABASE.SqlLite.value,
      label: SUPPORTED_DATABASE.SqlLite.label,
    },
  ];

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: {
      siteName: '',
      databaseProvider: availableDatabases[0].value,
      culture: '',
      sqliteDbConnectionString: 'Data Source=MixContent\\mix-cms.db',
    },
    validate: (values) => {
      let errs = {};
      if (values.siteName === '') errs['siteName'] = 'Site name is required';
      if (values.sqliteDbConnectionString === '') errs['sqliteDbConnectionString'] = 'Connection string is required';
      return errs;
    },
    onSubmit: (values) => {
      showGlobalToastNotification({title: 'Successfully', subTitle: 'Complete create site information', kind: 'success'})
      dispatch(createSiteSubmitEvent, <InitTenantModel>{
        siteName: values.siteName,
        sqliteDbConnectionString: values.sqliteDbConnectionString,
        databaseProvider: values.databaseProvider,
        culture: availableCutures.find(
          (v) => (v.specificulture = values.culture)
        ),
      });
    },
  });

  const sharedService = new MixSharedService(environment.baseUrl);
  MixApi.get(sharedService.getCulturesApi).then(
    (resp) => {
      (availableCutures = resp['items']),
        ($form.culture = availableCutures[0].specificulture);
    },
    (errs) => console.log(errs)
  );
</script>

<form on:submit={handleSubmit}>
  <FormGroup legendText="Your website title">
    <TextInput
      id="siteName"
      name="siteName"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.siteName}
    />
    {#if $errors.siteName}
      <span class="form-error">{$errors.siteName}</span>
    {/if}
  </FormGroup>

  <FormGroup>
    <Select
      labelText="Choose your langugae"
      id="culture"
      name="culture"
      bind:selected={$form.culture}
    >
      {#each availableCutures as culture}
        <SelectItem value={culture.specificulture} text={culture.fullName} />
      {/each}
    </Select>
  </FormGroup>

  <FormGroup>
    <Select
      labelText="Choose your server"
      id="database"
      name="database"
      bind:selected={$form.databaseProvider}
    >
      {#each availableDatabases as database}
        <SelectItem
          value={database.value.toString()}
          text={database.label.toString()}
        />
      {/each}
    </Select>
  </FormGroup>

  {#if $form.databaseProvider !== SUPPORTED_DATABASE.SqlLite.value}
    <FormGroup legendText="Database Name">
      <TextInput />
    </FormGroup>

    <FormGroup legendText="Database Username">
      <TextInput />
    </FormGroup>

    <FormGroup legendText="Database Password">
      <TextInput />
    </FormGroup>
  {:else}
    <FormGroup legendText="Database Connection String">
      <TextArea
        id="sqliteDbConnectionString"
        name="sqliteDbConnectionString"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.sqliteDbConnectionString}
      />

      {#if $errors.sqliteDbConnectionString}
        <span class="form-error">{$errors.sqliteDbConnectionString}</span>
      {/if}
    </FormGroup>
  {/if}

  <Button class="full-width"
          type="submit"
          icon={ArrowRight16}> Continue </Button>
</form>

<style lang="scss"></style>
