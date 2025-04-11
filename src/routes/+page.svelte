<script lang="ts">
	import PageContainer from '../components/layout/PageContainer.svelte';
	import LayoutContainer from '../components/layout/LayoutContainer.svelte';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
</script>

<PageContainer
	title="Dashboard"
	description="Welcome to Mixcore CMS"
>
	<LayoutContainer>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>Content</CardTitle>
					<CardDescription>Manage your content</CardDescription>
				</CardHeader>
				<CardContent>
					<p>You have 5 pages and 10 posts.</p>
				</CardContent>
			</Card>
			
			<Card>
				<CardHeader>
					<CardTitle>Design</CardTitle>
					<CardDescription>Customize your site</CardDescription>
				</CardHeader>
				<CardContent>
					<p>You have 2 active themes.</p>
				</CardContent>
			</Card>
			
			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
					<CardDescription>Manage your users</CardDescription>
				</CardHeader>
				<CardContent>
					<p>You have 3 active users.</p>
				</CardContent>
			</Card>
		</div>
	</LayoutContainer>
</PageContainer>
