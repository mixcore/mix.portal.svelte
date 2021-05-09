// const sveltePreprocess = require('svelte-preprocess');
import sveltePreprocess from 'svelte-preprocess';
//const node = require('@sveltejs/adapter-node');
// const static = require('@sveltejs/adapter-static');
import adapter from '@sveltejs/adapter-static';
// const pkg = require('./package.json');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess(),
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		}),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		// vite: {
		// 	ssr: {
		// 		noExternal: Object.keys(pkg.dependencies || pkg.devDependencies || {})
		// 	}
		// }
	}
};

export default config;