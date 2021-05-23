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
<Header company="MIXCORE" platformName="Portal" bind:isSideNavOpen>
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
		<SideNavLink href="/" text="Dashboard" />
		<SideNavMenu text="Posts">
			<SideNavMenuItem href="/" text="Create Post" />
			<SideNavMenuItem href="/post" text="Post List" />
			<SideNavMenuItem href="/" text="Draft Posts" />
		</SideNavMenu>
		<SideNavMenu text="Pages">
			<SideNavMenuItem href="/" text="Create Page" />
			<SideNavMenuItem href="/" text="Page List" />
			<SideNavMenuItem href="/" text="Draft Pages" />
		</SideNavMenu>
		<SideNavMenu text="Modules">
			<SideNavMenuItem href="/" text="Create Module" />
			<SideNavMenuItem href="/" text="Module List" />
			<SideNavMenuItem href="/" text="Draft Modules" />
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