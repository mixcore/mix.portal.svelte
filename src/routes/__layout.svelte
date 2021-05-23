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
import  Add32  from 'carbon-icons-svelte/lib/Add32';
import  Dashboard32  from 'carbon-icons-svelte/lib/Dashboard32';
import  Blog32  from 'carbon-icons-svelte/lib/Blog32';
import  Layers32  from 'carbon-icons-svelte/lib/Layers32';
import  ModelAlt32  from 'carbon-icons-svelte/lib/ModelAlt32';
import  Settings32  from 'carbon-icons-svelte/lib/Settings32';
import  Data_232  from 'carbon-icons-svelte/lib/Data_232';
	

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
		<SideNavLink icon={Dashboard32} href="/" text="Dashboard" />
		<SideNavMenu icon={Blog32} text="Posts">
			<SideNavMenuItem href="/post/create" text="Create Post" />
			<SideNavMenuItem href="/post" text="Post List" />
			<SideNavMenuItem href="/post/draft" text="Draft Posts" />
		</SideNavMenu>
		<SideNavMenu icon={Layers32} text="Pages">
			<SideNavMenuItem href="/post/create" text="Create Page" />
			<SideNavMenuItem href="/page" text="Page List" />
			<SideNavMenuItem href="/post/draft" text="Draft Pages" />
		</SideNavMenu>
		<SideNavMenu icon={ModelAlt32} text="Modules">
			<SideNavMenuItem href="/post/create" text="Create Module" />
			<SideNavMenuItem href="/module" text="Module List" />
			<SideNavMenuItem href="/post/draft" text="Draft Modules" />
		</SideNavMenu>
		<SideNavMenu icon={Data_232} text="Databases">
			<SideNavMenuItem href="/post/create" text="Create Database" />
			<SideNavMenuItem href="/database" text="Database List" />
			<SideNavMenuItem href="/post/draft" text="Draft Databases" />
		</SideNavMenu>
		<SideNavDivider />
		<SideNavLink icon={Settings32} text="Settings" />
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