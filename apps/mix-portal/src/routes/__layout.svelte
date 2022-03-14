<script context="module">
    /** @type {import('@sveltejs/kit').ErrorLoad} */
    export function load({ error, status }) {
      return {
        props: {
          title: `${status}: ''`
        }
      };
    } 
</script>

<script lang="ts">
  import { fly } from 'svelte/transition';
  import { InitStep, MixInitService } from '@mix.core/mix.lib';
  import {
    environment,
    hideLoading,
    loadingStore,
    MixSpinner,
    toastStore,
    removeNotification,
    MixApi
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
    MixApi.get<InitStep>(initSrv.getInitStatusEndpoint, true)
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

  :root {
    --cds-interactive-01: #f06;
    --cds-interactive-03: #f06;
    --cds-interactive-04: #f06;
    --cds-ui-01: #fffcf0;
  }

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

  .main-workspace {
    width: calc(100vw - 3rem);
    height: calc(100vh - 3rem);
    padding-top: 3.5rem;
    padding-left: 4rem;
  }

  .workspace-header {
    margin-top: 1rem;
    margin-bottom: 2rem;
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

  .mix-widget {
    background-color: var(--cds-ui-01);
    padding: 10px 20px;
    border-radius: 5px;
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
