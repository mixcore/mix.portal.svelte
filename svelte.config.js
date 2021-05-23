import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter({
			// default options are shown
			// pages: 'build',
			// assets: 'build',
			// fallback: null
		}),
		prerender: {
			enabled: false
		},
		ssr: false,
		vite: {
			// root: "./src",
			optimizeDeps: {
				include: ['clipboard-copy']
			},
			resolve: {
				alias: {
					// $components: resolve(__dirname, "./src/components"),
					// $stores: resolve(__dirname, "./src/stores"),
					$mixlib: resolve(__dirname, "./src/mix.lib.ts"),
				},
			},
			// esbuild: {
			// 	include: /\.(tsx?|jsx?)$/,
			// 	exclude: [],
			// 	loader: 'tsx'
			// }
		}
	}
};

export default config;
