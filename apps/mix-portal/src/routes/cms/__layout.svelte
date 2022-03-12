<script lang="ts">
  import {
    Header,
    HeaderAction,
    HeaderPanelDivider,
    HeaderPanelLink,
    HeaderPanelLinks,
    HeaderUtilities,
    Modal,
    SideNav,
    SideNavItems,
    SideNavLink,
    SkipToContent,
  } from 'carbon-components-svelte';
  import {
    authService,
    IMenuItem,
    MixLogo
  } from '@mix.core/shared';
  import Dashboard32 from 'carbon-icons-svelte/lib/Dashboard32';
  import PageNumber32 from 'carbon-icons-svelte/lib/PageNumber32';
  import Book32 from 'carbon-icons-svelte/lib/Book32';
  import UserAvatarFilledAlt20 from "carbon-icons-svelte/lib/UserAvatarFilledAlt20";
  import ModelBuilder20 from "carbon-icons-svelte/lib/ModelBuilder20";
  
  import { goto } from '$app/navigation';

  let isOpenLogoutConfirmModal = false;
  let isOpenUser = false;
  let isSideNavOpen = false;
  let sidebarItems: IMenuItem[] = [
    {
      label: 'Dashboard',
      value: '/cms',
      icon: Dashboard32,
    },
    {
      label: 'Posts',
      value: '/cms/posts',
      icon: PageNumber32,
    },
    {
      label: 'Pages',
      value: '/cms/pages',
      icon: Book32,
    },
    {
      label: 'Modules',
      value: '/cms/modules',
      icon: ModelBuilder20,
    },
  ];

  function logOut(): void {
    authService.logout().then(() => {
      isOpenLogoutConfirmModal = false;
      goto('account/sign-in');
    });
  }

  function openLogoutConfirmModal(): void {
    isOpenLogoutConfirmModal = true;
  }
</script>

<Header bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <MixLogo />

  <HeaderUtilities>
    <HeaderAction
      bind:isOpen={isOpenUser}
      icon={UserAvatarFilledAlt20}
      closeIcon={UserAvatarFilledAlt20}>
      <HeaderPanelLinks>
        <HeaderPanelLink>Account</HeaderPanelLink>
        <HeaderPanelLink>Language</HeaderPanelLink>
        <HeaderPanelDivider></HeaderPanelDivider>
        <HeaderPanelLink>Change Password</HeaderPanelLink>
        <HeaderPanelLink on:click={openLogoutConfirmModal}>Logout</HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>

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

<Modal
  size="sm"
  open={isOpenLogoutConfirmModal}
  modalHeading="Confirmation"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--primary={logOut}
  on:open
  on:close
  on:submit>
  <p>Do you want to log out ?</p>
</Modal>

<style lang="scss">
  .main-workspace {
    width: calc(100vw - 3rem);
    height: calc(100vh - 3rem);
    padding-top: 3.5rem;
    padding-left: 4rem;
  }
</style>
