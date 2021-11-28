<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { InitStep, MixInitService } from '@mix.core/mix.lib';
  import { MixHttps, hideLoading } from '@mix.core/shared';
  import { Modal } from 'carbon-components-svelte';

  let showInitForm: boolean = false;
  let preventCloseOnClickOutside: boolean = true;

  onMount(async () => {
    let initSrv = new MixInitService();
    initSrv.setBaseUrl('https://localhost:5010/api/v2');

    MixHttps.get<InitStep>(initSrv.getInitStatusApi).then((data) => {
      if (data === InitStep.Blank) {
        console.log(123);
        showInitForm = true;
        hideLoading();
      }
    });
  });
</script>

<Modal bind:open={showInitForm}
       bind:preventCloseOnClickOutside>
    Init Form
</Modal>
