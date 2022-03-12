<script lang="ts">
    import {
        DataTable,
        Toolbar,
        ToolbarContent,
        ToolbarSearch,
        Button,
    } from "carbon-components-svelte";
</script>

<div class="modules">
    <div class="container">
        <div class="row">
            <div class="col">
                <h3 class="workspace-header">Listing Modules </h3>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="row">
             <div class="col">
                <DataTable 
                        description="Your organization's active load balancers."
                        headers={[
                            { key: "name", value: "Post" },
                            { key: "protocol", value: "Author" },
                            { key: "port", value: "Created" },
                            { key: "rule", value: "Thumb" },
                        ]}
                        rows={[
                            {
                            id: "a",
                            name: "Load Balancer 3",
                            protocol: "HTTP",
                            port: 3000,
                            rule: "Round robin",
                            },
                            {
                            id: "b",
                            name: "Load Balancer 1",
                            protocol: "HTTP",
                            port: 443,
                            rule: "Round robin",
                            },
                            {
                            id: "c",
                            name: "Load Balancer 2",
                            protocol: "HTTP",
                            port: 80,
                            rule: "DNS delegation",
                            },
                            {
                            id: "d",
                            name: "Load Balancer 6",
                            protocol: "HTTP",
                            port: 3000,
                            rule: "Round robin",
                            },
                            {
                            id: "e",
                            name: "Load Balancer 4",
                            protocol: "HTTP",
                            port: 443,
                            rule: "Round robin",
                            },
                            {
                            id: "f",
                            name: "Load Balancer 5",
                            protocol: "HTTP",
                            port: 80,
                            rule: "DNS delegation",
                            },
                        ]}
                        >
                        <Toolbar>
                            <ToolbarContent>
                                <ToolbarSearch />
                                <Button>Create New Module</Button>
                            </ToolbarContent>
                        </Toolbar>
                </DataTable>
             </div>
        </div>
    </div>
</div>

<style lang="scss"></style>
