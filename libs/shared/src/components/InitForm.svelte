<script lang="ts">
    import type { AccountModel, InitTenantModel } from "@mix.core/mix.lib";
    import { ProgressIndicator, ProgressStep } from "carbon-components-svelte";
    import CreateAccountForm from "./CreateAccountForm.svelte";
    import CreateSiteForm from './CreateSiteForm.svelte';
    import SelectTheme from "./SelectTheme.svelte";

    let currentStep: number = 0;
    let initTenantData: InitTenantModel = undefined;
    let initAccountData: AccountModel = undefined;

    function onCreateSiteSubmit(event: CustomEvent<InitTenantModel>): void {
      initTenantData = event.detail;
      currentStep += 1;
    }

    function onCreateAccountSubmit(event: CustomEvent<AccountModel>): void {
      initAccountData = event.detail;
      currentStep += 1;
    }
</script>

<div class="init-form">
    <div class="container">
        <div class="row">
            <div class="init-form__container col-md-5">
              <h1 class="init-form__label">Setup - Step 1</h1>
        
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
                  <SelectTheme></SelectTheme>
                </div>
              {/if}
            </div>
        
            <div class="init-form__img col-md-7">
              <img src="/images/carbon-img-concept.svg" alt="concept">
            </div>
          </div>
    </div>
</div>

<style lang="scss">
  .init-form {
    position: fixed;
    width: 100vw;
    height: 100vh;

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
        display: flex;
        align-items: center;
        justify-content: center;

        > img {
            width: 80%;
            height: auto;
            object-fit: contain;
        }
    }
  }
</style>
