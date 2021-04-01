<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import { Button } from "carbon-components-svelte";
	import { DataTable } from "carbon-components-svelte";
</script>
<script context="module">
	export const ssr = false;
</script>

<main>
	<h1>Hello world!</h1>

	<Counter />
	<Button>Primary button</Button>
	<DataTable
  headers={[{ key: 'name', value: 'Name' }, { key: 'protocol', value: 'Protocol' }, { key: 'port', value: 'Port' }, { key: 'rule', value: 'Rule' }]}
  rows={[{ id: 'a', name: 'Load Balancer 3', protocol: 'HTTP', port: 3000, rule: 'Round robin' }, { id: 'b', name: 'Load Balancer 1', protocol: 'HTTP', port: 443, rule: 'Round robin' }, { id: 'c', name: 'Load Balancer 2', protocol: 'HTTP', port: 80, rule: 'DNS delegation' }, { id: 'd', name: 'Load Balancer 6', protocol: 'HTTP', port: 3000, rule: 'Round robin' }, { id: 'e', name: 'Load Balancer 4', protocol: 'HTTP', port: 443, rule: 'Round robin' }, { id: 'f', name: 'Load Balancer 5', protocol: 'HTTP', port: 80, rule: 'DNS delegation' }]}
/>
	<p>Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte apps.</p>
</main>

<style lang="scss">
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
	}

	p {
		max-width: 14rem;
		margin: 2rem auto;
		line-height: 1.35;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}

		p {
			max-width: none;
		}
	}
</style>
