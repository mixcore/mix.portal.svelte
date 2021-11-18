<script lang="ts">
  import {
    Header,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
    SideNavDivider,
  } from 'carbon-components-svelte';
  import Fade16 from 'carbon-icons-svelte/lib/Fade16';

  let isSideNavOpen = true;
</script>
<script context="module">
	export const ssr = false;
</script>

<Header bind:isSideNavOpen>
  <img
    class="mix-header-logo"
    src="/images/mixcore-logo-red-2.svg"
    alt="mix-logo"
  />

  <SideNav bind:isOpen={isSideNavOpen} rail>
    <SideNavItems>
      <SideNavLink icon={Fade16} text="Link 1" href="/" isSelected />
      <SideNavLink icon={Fade16} text="Link 2" href="/" />
      <SideNavLink icon={Fade16} text="Link 3" href="/" />
      <SideNavMenu icon={Fade16} text="Menu">
        <SideNavMenuItem href="/" text="Link 1" />
        <SideNavMenuItem href="/" text="Link 2" />
        <SideNavMenuItem href="/" text="Link 3" />
      </SideNavMenu>
      <SideNavDivider />
      <SideNavLink icon={Fade16} text="Link 4" href="/" />
    </SideNavItems>
  </SideNav>
</Header>

<h1 style="margin-top: 50px">ABC DEF GHIKLMN</h1>

<style global>
  @import 'carbon-components-svelte/css/white.css';

  .mix-header-logo {
    width: 145px;
  }
</style>
