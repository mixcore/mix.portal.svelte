<script lang="ts">
  import {
    Header,
    SideNav,
    SideNavItems,
    SideNavLink,
    SkipToContent,
  } from 'carbon-components-svelte';
  import {
    IMenuItem,
    MixLogo,
    MixSpinner,
    loadingStore,
    InitForm
  } from '@mix.core/shared';
  import Dashboard32 from 'carbon-icons-svelte/lib/Dashboard32';
  import PageNumber32 from 'carbon-icons-svelte/lib/PageNumber32';
  import Book32 from 'carbon-icons-svelte/lib/Book32';

  import { onMount } from 'svelte';
  import { InitStep, MixInitService } from '@mix.core/mix.lib';
  import { MixHttps, hideLoading, environment } from '@mix.core/shared';

  let isSideNavOpen = false;
  let isShowLoading = true;
  let isPortalReady = false;
  let isShowInitForm = false;
  let sidebarItems: IMenuItem[] = [
    {
      label: 'Dashboard',
      value: '/dashboard',
      icon: Dashboard32,
    },
    {
      label: 'Pages',
      value: '/navigations',
      icon: PageNumber32,
    },
    {
      label: 'Posts',
      value: '/posts',
      icon: Book32,
    },
  ];

  loadingStore.subscribe((isShow) => (isShowLoading = isShow));
  onMount(async () => {
    let initSrv = new MixInitService(environment.baseUrl);
    MixHttps.get<InitStep>(initSrv.getInitStatusApi).then((data) => {
      if (data === InitStep.Blank) {
        isShowInitForm = true;
        isPortalReady = false;
      } else {
        isPortalReady = true;
        isShowInitForm = false;
      }

      hideLoading();
    });
  });
</script>

{#if isPortalReady}
<Header bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <MixLogo />

  <SideNav bind:isOpen={isSideNavOpen} rail>
    <SideNavItems>
      {#each sidebarItems as item}
        <SideNavLink icon={item.icon} text={item.label} href={item.value} />
      {/each}
    </SideNavItems>
  </SideNav>
</Header>

<div class="main-workspace">
  <slot />
</div>
{/if}

{#if isShowInitForm}
  <InitForm></InitForm>
{/if}

{#if isShowLoading}
  <MixSpinner />
{/if}

<style global>
  @import 'carbon-components-svelte/css/all.css';

  body {
    margin: 0 !important;
  }

  .bx--header__name {
    display: none !important;
  }

  .bx--side-nav__item {
    margin-bottom: 10px;
  }

  .bx--fieldset  {
     margin-bottom: 1rem !important;
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

  @keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-moz-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-webkit-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-o-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-ms-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
}
</style>
