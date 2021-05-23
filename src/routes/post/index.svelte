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
	DataTableSkeleton,
	Pagination,
	Form,
    FormGroup,
    Checkbox,
    RadioButtonGroup,
    RadioButton,
    Select,
    SelectItem,
  } from "carbon-components-svelte";

  import Save16 from "carbon-icons-svelte/lib/Save16";
  import Delete16 from "carbon-icons-svelte/lib/Delete16";
  import Add16 from "carbon-icons-svelte/lib/Add16";
  import Download16 from "carbon-icons-svelte/lib/Download16";
  import SettingsAdjust32 from "carbon-icons-svelte/lib/SettingsAdjust32";

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
  let skeleton;

  $: console.log("selectedRowIds", selectedRowIds);
	
	onMount(async () => {
		// skeleton.hide();
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
	<!-- <DataTableSkeleton bind:this="{skeleton}" /> -->
	<DataTable selectable bind:selectedRowIds sortable  {headers} {rows}>
		<Toolbar>
			<ToolbarBatchActions>
				<Button icon={Download16}>Download</Button>
			  	<Button icon={Delete16}>Delete</Button>
			</ToolbarBatchActions>
			<ToolbarContent>
			<ToolbarSearch />
			<ToolbarMenu icon={SettingsAdjust32}>
				
				<Form on:submit>
					<FormGroup legendText="Checkboxes">
					<Checkbox id="checkbox-0" labelText="Checkbox Label" checked />
					<Checkbox id="checkbox-1" labelText="Checkbox Label" />
					<Checkbox id="checkbox-2" labelText="Checkbox Label" disabled />
					</FormGroup>
					<FormGroup legendText="Radio buttons">
					<RadioButtonGroup name="radio-button-group" selected="default-selected">
						<RadioButton
						id="radio-1"
						value="standard"
						labelText="Standard Radio Button"
						/>
						<RadioButton
						id="radio-2"
						value="default-selected"
						labelText="Default Selected Radio Button"
						/>
						<RadioButton
						id="radio-4"
						value="disabled"
						labelText="Disabled Radio Button"
						disabled
						/>
					</RadioButtonGroup>
					</FormGroup>
					<FormGroup>
					<Select id="select-1" labelText="Select menu" value="placeholder-item">
						<SelectItem
						disabled
						hidden
						value="placeholder-item"
						text="Choose an option"
						/>
						<SelectItem value="option-1" text="Option 1" />
						<SelectItem value="option-2" text="Option 2" />
						<SelectItem value="option-3" text="Option 3" />
					</Select>
					</FormGroup>
					<Button type="submit">Submit</Button>
				</Form>
			</ToolbarMenu>
			<ToolbarMenu icon={Download16}>
				<ToolbarMenuItem primaryFocus>Download to CSV</ToolbarMenuItem>
			</ToolbarMenu>
			<ToolbarMenu>
				<ToolbarMenuItem primaryFocus>Refresh</ToolbarMenuItem>
			</ToolbarMenu>
			<Button icon={Add16}>Create post</Button>
			</ToolbarContent>
		</Toolbar>
		<span slot="cell" let:cell>
			{#if cell.key === 'overflow'}
			  <OverflowMenu flipped>
				<OverflowMenuItem text="Edit" />
				<OverflowMenuItem text="Copy" />
				<OverflowMenuItem text="Preview" />
				<OverflowMenuItem danger text="Delete" />
			  </OverflowMenu>
			{:else}{cell.value}{/if}
		  </span>
	</DataTable>
	<Pagination totalItems={102} pageSizes={[10, 15, 20]} />

</section>
