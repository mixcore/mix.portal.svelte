<script lang="ts">
import { goto } from '$app/navigation';

  import type { ThemeModel } from '@mix.core/mix.lib';
  import { InitForm } from '@mix.core/shared';
  import { CryptoService } from '@mix.core/mix.lib';

  function createTenant(event: CustomEvent<ThemeModel>): void {
    goto('/account/sign-in');
  }

  function demo(){
    let text = 'test ecrypt';
    let key =
      'MFBud2srMG1IYWRBakZ6dmFMR0RTQT09LG14UDBYc0ZHUGZRc29pYmVJODFyWUZ2OGVZWWdJRFJ0U28wL1phV0FEeGs9';
    console.log('text:' + text);
    var cryptoSrv = new CryptoService();
    let encrypted = cryptoSrv.encryptAES(text, key);
    console.log(encrypted);
  }
  demo();

</script>

<InitForm on:onSubmitInitTenantEvt={createTenant} />

<style>
</style>
