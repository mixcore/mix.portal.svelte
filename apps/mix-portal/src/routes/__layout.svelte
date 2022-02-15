<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate'
  import { InitStep, MixInitService } from '@mix.core/mix.lib';
  import {
    environment,
    hideLoading,
    loadingStore,
    MixHttps,
    MixSpinner,
    toastStore,
    removeNotification
  } from '@mix.core/shared';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { ToastNotification } from "carbon-components-svelte";
  import type { IToastOption } from 'libs/shared/src/stores/toast/toast.store';

  let isShowLoading: boolean = true;
  let toasts: IToastOption[] = [];
  let initSrv = new MixInitService(environment.baseUrl);
  loadingStore.subscribe((isShow) => (isShowLoading = isShow));
  toastStore.subscribe((t) => toasts = t)

  onMount(async () => {
    MixHttps.get<InitStep>(initSrv.getInitStatusApi)
      .then((data) => {
        switch (data) {
          case InitStep.Blank:
            goto('/install');
            break;
          default:
            goto('/cms');
            break;
        }
      })
      .catch(() => goto('/error'))
      .finally(() => hideLoading());
  });
</script>

<slot />

{#if isShowLoading}
  <MixSpinner />
{/if}

<div class="mix-toast-container">
  {#each toasts as toast}
    <div in:fly>
        <ToastNotification lowContrast
                           title="{toast.title}" 
                           subtitle="{toast.subTitle}"
                           kind="{toast.kind}"
                           timeout="{toast.timeOut}"
                           caption={new Date().toLocaleString()}
                           on:close={() => removeNotification(toast.id)} />
    </div>
  {/each}
</div>


<style global>
  @import 'carbon-components-svelte/css/all.css';

  body {
    margin: 0 !important;
  }

  .mix-toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
  }

  .bx--header__name {
    display: none !important;
  }

  .bx--side-nav__item {
    margin-bottom: 10px;
  }

  .bx--fieldset {
    margin-bottom: 1rem !important;
  }

  .bx--btn {
    border-radius: 8px;
  }

  .main-workspace {
    width: calc(100vw - 3rem);
    height: calc(100vh - 3rem);
    padding-top: 3.5rem;
    padding-left: 4rem;
  }

  .form-error {
    display: block;
    margin-top: 5px;
    color: var(--cds-support-error);
    animation: fadeIn 0.3s;
  }

  .full-width {
    width: 100% !important;
    max-width: unset !important;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
