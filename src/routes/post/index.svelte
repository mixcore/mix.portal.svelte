<script context="module" lang="ts">
	export const prerender = true;
	// export const ssr = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import {
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    Button,
    OverflowMenu,
    OverflowMenuItem,
    ToolbarBatchActions,
  } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  
  const headers = [
    { key: "name", value: "Name" },
    { key: "port", value: "Port" },
    { key: "rule", value: "Rule" },
    { key: "overflow", empty: true },
  ];

  const rows = [
    { id: "a", name: "Load Balancer 3", port: 3000, rule: "Round robin" },
    { id: "b", name: "Load Balancer 1", port: 443, rule: "Round robin" },
    { id: "c", name: "Load Balancer 2", port: 80, rule: "DNS delegation" },
    { id: "d", name: "Load Balancer 6", port: 3000, rule: "Round robin" },
    { id: "e", name: "Load Balancer 4", port: 443, rule: "Round robin" },
    { id: "f", name: "Load Balancer 5", port: 80, rule: "DNS delegation" },
    { id: "g", name: "Load Balancer 3", port: 3000, rule: "Round robin" },
    { id: "h", name: "Load Balancer 1", port: 443, rule: "Round robin" },
    { id: "i", name: "Load Balancer 2", port: 80, rule: "DNS delegation" },
    { id: "j", name: "Load Balancer 6", port: 3000, rule: "Round robin" },
    { id: "k", name: "Load Balancer 4", port: 443, rule: "Round robin" },
    { id: "l", name: "Load Balancer 5", port: 80, rule: "DNS delegation" },
  ];
		
  let selectedRowIds = [];

  $: console.log("selectedRowIds", selectedRowIds);
	
	onMount(async () => {
	});

	
</script>

<svelte:head>
	<title>Post List - Mixcore Portal</title>
</svelte:head>

<section>
	<h1>Post List</h1>
	<p>
		Use the filter side bar on the right to filter and search your post.
	</p>
	<br/>

	<DataTable selectable bind:selectedRowIds sortable  {headers} {rows}>
		<Toolbar>
			<ToolbarBatchActions>
			  <Button icon={Save16}>Save</Button>
			</ToolbarBatchActions>
			<ToolbarContent>
			<ToolbarSearch />
			<ToolbarMenu>
				<ToolbarMenuItem primaryFocus>Restart all</ToolbarMenuItem>
				<ToolbarMenuItem href="https://cloud.ibm.com/docs/loadbalancer-service">
				API documentation
				</ToolbarMenuItem>
				<ToolbarMenuItem danger>Stop all</ToolbarMenuItem>
			</ToolbarMenu>
			<Button>Create balancer</Button>
			</ToolbarContent>
		</Toolbar>
		<span slot="cell" let:cell>
			{#if cell.key === 'overflow'}
			  <OverflowMenu flipped>
				<OverflowMenuItem text="Restart" />
				<OverflowMenuItem
				  href="https://cloud.ibm.com/docs/loadbalancer-service"
				  text="API documentation"
				/>
				<OverflowMenuItem danger text="Stop" />
			  </OverflowMenu>
			{:else}{cell.value}{/if}
		  </span>
	</DataTable>

</section>
