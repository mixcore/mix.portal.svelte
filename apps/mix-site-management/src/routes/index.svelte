<script>
    import {
      Header,
      HeaderNav,
      HeaderNavItem,
      SideNav,
      SideNavItems,
      SideNavMenu,
      SideNavMenuItem,
      SideNavLink,
      SideNavDivider,
      SkipToContent,
    } from "carbon-components-svelte";
    import Fade16 from "carbon-icons-svelte/lib/Fade16";
    import { PortalSidebar } from '@mix.core/shared';
  
    let isSideNavOpen = false;
  </script>
    
  <PortalSidebar />
  <Header bind:isSideNavOpen>
    <img class="mix-header-logo" src="/images/mixcore-logo-red-2.svg" alt="mix-logo">
    <div slot="skip-to-content">
      <SkipToContent />
    </div>
  
    <HeaderNav>
      <HeaderNavItem href="/" text="Documentations" />
    </HeaderNav>
  
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
  <slot></slot>
  