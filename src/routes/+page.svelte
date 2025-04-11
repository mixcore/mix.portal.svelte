<script lang="ts">
	import { onMount } from 'svelte';
	import PageContainer from '../components/layout/PageContainer.svelte';
	import LayoutContainer from '../components/layout/LayoutContainer.svelte';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '$lib/components/ui/card';
	
	// State
	let isLoading = true;
	let hasError = false;
	let errorMessage = '';
	
	// Breadcrumbs
	const breadcrumbs = [
		{ label: 'Dashboard', href: '/' }
	];
	
	// Load dashboard data
	onMount(() => {
		// Simulate API loading
		setTimeout(() => {
			try {
				// Simulate data loaded successfully
				isLoading = false;
			} catch (error) {
				isLoading = false;
				hasError = true;
				errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data';
			}
		}, 1000);
	});
</script>

<PageContainer
	title="Dashboard"
	description="Welcome to Mixcore CMS"
	breadcrumbs={breadcrumbs}
	isLoading={isLoading}
	hasError={hasError}
	errorMessage={errorMessage}
	headerBorder={true}
	size="lg"
>
	<div slot="header">
		<button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
			Refresh
		</button>
	</div>
	
	<LayoutContainer padded={false} shadowed={false}>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>Content</CardTitle>
					<CardDescription>Manage your content</CardDescription>
				</CardHeader>
				<CardContent>
					<p>You have 5 pages and 10 posts.</p>
				</CardContent>
				<CardFooter>
					<a href="/content" class="text-sm text-primary hover:underline">View content</a>
				</CardFooter>
			</Card>
			
			<Card>
				<CardHeader>
					<CardTitle>Design</CardTitle>
					<CardDescription>Customize your site</CardDescription>
				</CardHeader>
				<CardContent>
					<p>You have 2 active themes.</p>
				</CardContent>
				<CardFooter>
					<a href="/design" class="text-sm text-primary hover:underline">Manage design</a>
				</CardFooter>
			</Card>
			
			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
					<CardDescription>Manage your users</CardDescription>
				</CardHeader>
				<CardContent>
					<p>You have 3 active users.</p>
				</CardContent>
				<CardFooter>
					<a href="/users" class="text-sm text-primary hover:underline">Manage users</a>
				</CardFooter>
			</Card>
		</div>
	</LayoutContainer>
	
	<div slot="footer" class="text-center text-sm text-muted-foreground">
		<p>Mixcore CMS - Modern Content Management System</p>
	</div>
</PageContainer>
