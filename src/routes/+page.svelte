<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
</script>

<div class="flex-1 space-y-4 p-4 md:p-8 pt-6">
	<div class="flex items-center justify-between space-y-2">
		<h2 class="text-3xl font-bold tracking-tight">Welcome to Mixcore CMS</h2>
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
			<div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
				<h3 class="tracking-tight text-sm font-medium">Total Projects</h3>
			</div>
			<div class="p-6 pt-0">
				<div class="text-2xl font-bold">12</div>
				<p class="text-xs text-muted-foreground">+2 since last month</p>
			</div>
		</div>
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
			<div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
				<h3 class="tracking-tight text-sm font-medium">Active Users</h3>
			</div>
			<div class="p-6 pt-0">
				<div class="text-2xl font-bold">+573</div>
				<p class="text-xs text-muted-foreground">+201 since last hour</p>
			</div>
		</div>
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
			<div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
				<h3 class="tracking-tight text-sm font-medium">Content Items</h3>
			</div>
			<div class="p-6 pt-0">
				<div class="text-2xl font-bold">2,345</div>
				<p class="text-xs text-muted-foreground">+180 new items</p>
			</div>
		</div>
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
			<div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
				<h3 class="tracking-tight text-sm font-medium">Active Subscriptions</h3>
			</div>
			<div class="p-6 pt-0">
				<div class="text-2xl font-bold">+2350</div>
				<p class="text-xs text-muted-foreground">+180 since last month</p>
			</div>
		</div>
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
		<div class="col-span-4">
			<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div class="flex flex-col space-y-1.5 p-6">
					<h3 class="text-2xl font-semibold leading-none tracking-tight">Recent Projects</h3>
					<p class="text-sm text-muted-foreground">Your most recent projects and their status.</p>
				</div>
				<div class="p-6 pt-0">
					<div class="space-y-4">
						{#each Array(5) as _, i}
							<div class="flex items-center">
								<div class="flex items-center gap-4 flex-1">
									<div class="w-9 h-9 rounded-full bg-primary/10"></div>
									<div class="flex flex-col gap-1">
										<span class="text-sm font-medium leading-none">Project {i + 1}</span>
										<span class="text-sm text-muted-foreground">Updated 2h ago</span>
									</div>
								</div>
								<ChevronRight class="h-4 w-4" />
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<div class="col-span-3">
			<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div class="flex flex-col space-y-1.5 p-6">
					<h3 class="text-2xl font-semibold leading-none tracking-tight">Recent Activity</h3>
					<p class="text-sm text-muted-foreground">Your recent activity and updates.</p>
				</div>
				<div class="p-6 pt-0">
					<div class="space-y-4">
						{#each Array(5) as _, i}
							<div class="flex items-center gap-4">
								<div class="w-2 h-2 rounded-full bg-primary"></div>
								<div class="flex flex-col gap-1">
									<span class="text-sm font-medium leading-none">Activity {i + 1}</span>
									<span class="text-sm text-muted-foreground">{i + 1}h ago</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
