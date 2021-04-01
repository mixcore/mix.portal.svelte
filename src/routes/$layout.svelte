<script lang="ts">
	import '../app.scss';
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
  import { expoIn } from "svelte/easing";

  let isSideNavOpen = false;
  let isOpen = false;
  let selected = "0";
  let transitions = {
    "0": {
      text: "Default (duration: 200ms)",
      value: { duration: 200 },
    },
    "1": {
      text: "Custom (duration: 600ms, delay: 50ms, easing: expoIn)",
      value: { duration: 600, delay: 50, easing: expoIn },
    },
    "2": {
      text: "Disabled",
      value: false,
    },
  };

  const data = [
    {
      href: "/",
      text: "Kubernetes Service",
      description:
        "Deploy secure, highly available apps in a native Kubernetes experience. IBM Cloud Kubernetes Service creates a cluster of compute hosts and deploys highly available containers.",
    },
    {
      href: "/",
      text: "Red Hat OpenShift on IBM Cloud",
      description:
        "Deploy and secure enterprise workloads on native OpenShift with developer focused tools to run highly available apps. OpenShift clusters build on Kubernetes container orchestration that offers consistency and flexibility in operations.",
    },
    {
      href: "/",
      text: "Container Registry",
      description:
        "Securely store container images and monitor their vulnerabilities in a private registry.",
    },
    {
      href: "/",
      text: "Code Engine",
      description:
        "Run your application, job, or container on a managed serverless platform.",
    },
  ];
  let ref = null;
  let active = false;
  let value = "";
  let selectedResultIndex = 0;
  let events = [];

  $: lowerCaseValue = value.toLowerCase();
  $: results =
    value.length > 0
      ? data.filter((item) => {
          return (
            item.text.toLowerCase().includes(lowerCaseValue) ||
            item.description.includes(lowerCaseValue)
          );
        })
      : [];

  $: console.log("ref", ref);
  $: console.log("active", active);
  $: console.log("value", value);
  $: console.log("selectedResultIndex", selectedResultIndex);
</script>
<script context="module">
	export const ssr = false;
</script>

<Header 
	persistentHamburgerMenu={true}
	company="Mixcore" platformName="CMS" bind:isSideNavOpen>
	<div slot="skip-to-content">
	  <SkipToContent />
	</div>
	<HeaderUtilities>
		<HeaderSearch
			bind:ref
			bind:active
			bind:value
			bind:selectedResultIndex
			placeholder="Search services"
			{results}
			on:active={() => {
				events = [...events, { type: 'active' }];
			}}
			on:inactive={() => {
				events = [...events, { type: 'inactive' }];
			}}
			on:clear={() => {
				events = [...events, { type: 'clear' }];
			}}
			on:select={(e) => {
				events = [...events, { type: 'select', ...e.detail }];
			}}
			/>
	  <HeaderAction bind:isOpen transition={transitions[selected].value}>
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
	  <SideNavLink href="/settings" text="Settings" />
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