<script lang="ts">
    import {
      Header,
      SideNav,
      SideNavItems,
      SideNavLink,
      SkipToContent
    } from 'carbon-components-svelte';
    import { 
      IMenuItem,
      MixLogo,
      MixSpinner,
      loadingStore } from '@mix.core/shared';
    import Dashboard32 from "carbon-icons-svelte/lib/Dashboard32";
    import PageNumber32 from "carbon-icons-svelte/lib/PageNumber32";
    import Book32 from "carbon-icons-svelte/lib/Book32";
  
    let isSideNavOpen = false;
    let isShowLoading = true;
    let sidebarItems: IMenuItem[] = [
      {
        label: 'Dashboard',
        value: '/dashboard',
        icon: Dashboard32
      },
      {
        label: 'Pages',
        value: '/navigations',
        icon: PageNumber32
      },
      {
        label: 'Posts',
        value: '/posts',
        icon: Book32
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
          <SideNavLink icon={item.icon}
                       text={item.label}
                       href={item.value} />
        {/each}
      </SideNavItems>
    </SideNav>
  </Header>
  
  <div class="main-workspace">
    <slot></slot>
  </div>

  {#if isShowLoading}
    <MixSpinner></MixSpinner>
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
  
    .main-workspace {
      width: calc(100vw - 3rem);
      height: calc(100vh - 3rem);
      padding-top: 3.5rem;
      padding-left: 4rem;
    }
  </style>
  