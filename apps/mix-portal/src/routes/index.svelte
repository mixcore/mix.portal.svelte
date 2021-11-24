<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { MixModelType, MixPortalRepository } from '@mix.core/libs';

  onMount(async () => {
    fetch('https://localhost:5010/api/v2/mix-theme/setup/get-init-status')
    .then(res => res.json())
    .then(data => console.log(data));

    // const repo = new MixPortalRepository(MixModelType.Post);
    // repo.getListModel().then(value => console.log(value));
  })
</script>