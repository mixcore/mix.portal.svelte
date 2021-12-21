<script lang="ts">
    import type { AccountModel, InitTenantModel, ThemeModel } from "@mix.core/mix.lib";
    import { ProgressIndicator, ProgressStep } from "carbon-components-svelte";
    import { createEventDispatcher } from "svelte";
    import CreateAccountForm from "./CreateAccountForm.svelte";
    import CreateSiteForm from './CreateSiteForm.svelte';
    import SelectTheme from "./SelectTheme.svelte";

    const dispath = createEventDispatcher();
    const onSubmitInitTenantEvt: string = 'onSubmitInitTenantEvt';

    let initTenantData: InitTenantModel = undefined;
    let initAccountData: AccountModel = undefined;
    
    let currentStep: number = 0;
    let titleLabel: string = 'Create Site Informations';

    function onCreateSiteSubmit(event: CustomEvent<InitTenantModel>): void {
      initTenantData = event.detail;
      currentStep += 1;
      titleLabel = 'Create Admin Account'
    }

    function onCreateAccountSubmit(event: CustomEvent<AccountModel>): void {
      initAccountData = event.detail;
      currentStep += 1;
      titleLabel = 'Choose Theme'
    }

    function onThemeSubmit(event: CustomEvent<ThemeModel>): void {
      dispath(onSubmitInitTenantEvt, event.detail);
    }
</script>

<div class="init-form">
    <div class="container">
        <div class="row">
            <div class="init-form__container {currentStep == 2 ? 'col-12' : 'col-md-5'}">
              <h3 class="init-form__label">Setup - {titleLabel}</h3>
        
              <div class="init-form__propress">
                <ProgressIndicator currentIndex={currentStep}>
                    <ProgressStep
                      current={currentStep === 0}
                      label={currentStep === 0 ? 'Current Step' : 'Step 1'}
                      description="The progress indicator will listen for clicks on the steps"/>
                    <ProgressStep
                      current={currentStep === 1}
                      label={currentStep === 1 ? 'Current Step' : 'Step 2'}/>
                    <ProgressStep
                      current={currentStep === 2}
                      label={currentStep === 2 ? 'Current Step' : 'Step 3'}/>
                </ProgressIndicator>
              </div>
              
              {#if currentStep === 0}
                <div class="init-form__form">
                  <CreateSiteForm on:onCreateSiteSubmit={onCreateSiteSubmit}></CreateSiteForm>
                </div>
              {/if}

              {#if currentStep === 1}
                <div class="init-form__form">
                  <CreateAccountForm on:onCreateACcountSubmit={onCreateAccountSubmit}></CreateAccountForm>
                </div>
              {/if}

              {#if currentStep === 2}
                <div class="init-form__form">
                  <SelectTheme on:onThemeSubmit={onThemeSubmit}></SelectTheme>
                </div>
              {/if}
            </div>
        
            <div class="init-form__img">
              {#if currentStep === 2}
                <img src="/images/mix-concept-blank.svg" alt="concept">
              {:else}
                <img src="/images/mix-concept.svg" alt="concept">
              {/if}
            </div>
          </div>
    </div>
</div>

<style lang="scss">
  .init-form {
    position: fixed;
    width: 100vw;
    height: 100vh;
    overflow: auto;

    &__container {
        padding-top: 30px;
    }

    &__form {
        padding-top: 30px;
    }

    &__label {
        margin-bottom: 20px;
    }

    &__img {
        position: absolute;
        width: 100%;
        top: 0;
        right: 0;
        z-index: -1;

        display: flex;
        justify-content: flex-end;

        > img {
            width: 50%;
            height: auto;
            object-fit: contain;
        }
    }
  }
</style>
