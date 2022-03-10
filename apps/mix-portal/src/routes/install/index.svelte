<script lang="ts">
import { goto } from '$app/navigation';

  import {
    AccountModel,
    InitTenantModel,
    MixInitService,
    ThemeModel,
  } from '@mix.core/mix.lib';
  import { environment, InitForm, showLoading, hideLoading, MixApi } from '@mix.core/shared';

  function createTenant(
    event: CustomEvent<{
      tenantData: InitTenantModel;
      themeData: ThemeModel;
      accountData: AccountModel;
    }>
  ): void {
    let initSrv = new MixInitService(environment.baseUrl);
    let initFullTenantData = {
      tenantData: event.detail.tenantData,
      accountData: event.detail.accountData
    }

    Promise.resolve()
           .then(() => showLoading())
           .then(() => MixApi.post(initSrv.initFullTenantEndpoint, initFullTenantData))
           .then(() => goto('/account/sign-in'))
           .catch((err) => {console.error(err)})
           .finally(() => hideLoading())
  }
</script>

<InitForm on:onSubmitInitTenantEvt={createTenant} />

<style>
</style>
