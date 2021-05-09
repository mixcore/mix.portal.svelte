<script lang="ts">
	import {
		Header,
		HeaderSearch,
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
	} from "carbon-components-svelte";
	
	export let isSideNavOpen = true;
	</script>
	
	
	  <SideNav bind:isOpen={isSideNavOpen}>
		<SideNavItems>
		  <SideNavLink href="/ecommerce/create" text="Create Product" />
		  <SideNavLink text="Link 2" />
		  <SideNavLink text="Link 3" />
		  <SideNavMenu text="Menu">
			<SideNavMenuItem href="/" text="Link 1" />
			<SideNavMenuItem href="/" text="Link 2" />
			<SideNavMenuItem href="/" text="Link 3" />
		  </SideNavMenu>
		</SideNavItems>
	  </SideNav>
	  
	  <Content>
		<Grid>
		  <Row>
			<Column>
	
			  <slot />
	
			</Column>
		  </Row>
		</Grid>
	  </Content>