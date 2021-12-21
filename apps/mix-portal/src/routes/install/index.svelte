<script lang="ts">
import { goto } from '$app/navigation';

  import type { ThemeModel } from '@mix.core/mix.lib';
  import { InitForm } from '@mix.core/shared';

  function createTenant(event: CustomEvent<ThemeModel>): void {
    goto('/account/sign-in');
  }
</script>

<InitForm on:onSubmitInitTenantEvt={createTenant} />

<style>
</style>