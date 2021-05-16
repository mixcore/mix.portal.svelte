<script lang="ts">
	// import Header from '$lib/Header/index.svelte';
	import '../app.css';
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SideNav,
		SideNavItems,
		SideNavMenu,
		SideNavMenuItem,
		SideNavLink,
		SkipToContent,
		Content,
		Grid,
		Row,
		Column,
		TileGroup,
		RadioTile,
		SideNavDivider
	} from "carbon-components-svelte";
	

	let isSideNavOpen = false;
	let isOpen = false;
</script>
<Header company="Mixcore" platformName="Portal" bind:isSideNavOpen>
	<div slot="skip-to-content">
	  <SkipToContent />
	</div>
	<HeaderUtilities>
	  <HeaderAction bind:isOpen transition={{duration: 200}}>
		<HeaderPanelLinks>
		  <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
		  <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
		  <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
		  <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
		  <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
		  <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
		  <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
		  <HeaderPanelLink>Switcher item 5</HeaderPanelLink>
		</HeaderPanelLinks>
	  </HeaderAction>
	</HeaderUtilities>
  </Header>
  
<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
	  <SideNavLink text="Link 1" />
	  <SideNavLink text="Link 2" />
	  <SideNavLink text="Link 3" />
	  <SideNavMenu text="Menu">
		<SideNavMenuItem href="/" text="Link 1" />
		<SideNavMenuItem href="/" text="Link 2" />
		<SideNavMenuItem href="/" text="Link 3" />
	  </SideNavMenu>
	  <SideNavDivider />
	  <SideNavLink text="Link 4" />
	</SideNavItems>
  </SideNav>
  
  <Content>
	<Grid>
	  <Row>
		<Column>
		  <slot/>
		</Column>
	  </Row>
	</Grid>
  </Content>