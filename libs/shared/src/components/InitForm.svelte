<script context="module">
    export const ssr = false;
</script>

<script lang="ts">
    import { ProgressIndicator, ProgressStep, Form, FormGroup, TextInput, Select, SelectItem } from "carbon-components-svelte";

    let currentStep: number = 0;
    let siteName = null;

    function onStepChange(step: number): void {
        currentStep = step;
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
                      on:click={() => onStepChange(0)}
                      label={currentStep === 0 ? 'Current Step' : 'Step 1'}
                      description="The progress indicator will listen for clicks on the steps"/>
                    <ProgressStep
                      current={currentStep === 1}
                      on:click={() => onStepChange(1)}
                      label={currentStep === 1 ? 'Current Step' : 'Step 2'}/>
                    <ProgressStep
                      current={currentStep === 2}
                      on:click={() => onStepChange(2)}
                      label={currentStep === 2 ? 'Current Step' : 'Step 3'}/>
                </ProgressIndicator>
              </div>
              
              {#if currentStep === 0}
                <div class="init-form__form">
                    <Form>
                        <FormGroup legendText="Your website title">
                            <input type="text"
                              bind:value={siteName}/>
                        </FormGroup>

                        <FormGroup>
                            <Select labelText="Choose your langugae">
                              <SelectItem value="option-1" text="Option 1" />
                              <SelectItem value="option-2" text="Option 2" />
                              <SelectItem value="option-3" text="Option 3" />
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Select labelText="Choose your server">
                              <SelectItem value="option-1" text="Option 1" />
                              <SelectItem value="option-2" text="Option 2" />
                              <SelectItem value="option-3" text="Option 3" />
                            </Select>
                        </FormGroup>

                        <FormGroup legendText="Database Name">
                            <TextInput></TextInput>
                        </FormGroup>

                        <FormGroup legendText="Database Username">
                            <TextInput></TextInput>
                        </FormGroup>

                        <FormGroup legendText="Database Password">
                            <TextInput></TextInput>
                        </FormGroup>
                    </Form>
                </div>
              {/if}

              {#if currentStep === 1}
                <div class="init-form__form">
                    Form Users Works
                </div>
              {/if}

              {#if currentStep === 2}
                <div class="init-form__form">
                    Form Theme Works
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
