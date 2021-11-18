<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import {
    Header,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
    SideNavDivider,
    SkipToContent
  } from 'carbon-components-svelte';
  import Fade16 from 'carbon-icons-svelte/lib/Fade16';
  import { MixLogo } from '@mix.core/shared';

  let isSideNavOpen = false;

  let sidebarItems: {label: string, value: string}[] = [
    {
      label: 'Dashboard',
      value: '/dashboard'
    },
    {
      label: 'Navigation',
      value: '/Navigation'
    }
  ]
</script>

<Header  bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <MixLogo></MixLogo>

  <SideNav bind:isOpen={isSideNavOpen} rail>
    <SideNavItems>
      {#each sidebarItems as item}
        <SideNavLink icon={Fade16} text={item.label} href={item.value} />
      {/each}
    </SideNavItems>
  </SideNav>
</Header>

<div class="main-workspace">
  <h1>Main Workspace Work</h1>
</div>

<style global>
  @import 'carbon-components-svelte/css/all.css';

  body {
    margin: 0 !important;
  }

  .bx--header__name {
    display: none !important;
  }

  .mix-header-logo {
    margin-left: 15px;
  }

  .main-workspace {
    width: calc(100vw - 3rem);
    height: calc(100vh - 3rem);
    padding-top: 3rem;
    padding-left: 4rem;
  }
</style>
