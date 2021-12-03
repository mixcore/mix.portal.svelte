<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { InitStep, MixInitService } from '@mix.core/mix.lib';
  import { MixHttps, hideLoading } from '@mix.core/shared';

  onMount(async () => {
    let initSrv = new MixInitService();
    initSrv.setBaseUrl('https://localhost:5010/api/v2');

    MixHttps.get<InitStep>(initSrv.getInitStatusApi).then((data) => {
      if (data === InitStep.Blank) {
        hideLoading();
      }
    });
  });
</script>
