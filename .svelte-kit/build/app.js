import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"/favicon.ico\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t" + head + "\n\t</head>\n\t<body>\n\t\t<div id=\"svelte\">" + body + "</div>\n\t</body>\n</html>\n";

let options = null;

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: "/./_app/start-ac8f7628.js",
			css: ["/./_app/assets/start-a8cd1609.css","/./_app/assets/vendor-1405fc18.css"],
			js: ["/./_app/start-ac8f7628.js","/./_app/chunks/vendor-4168d81c.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => "/./_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: error => {
			console.error(error.stack);
			error.stack = options.get_stack(error);
		},
		hooks: get_hooks(user_hooks),
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		read: settings.read,
		root,
		router: true,
		ssr: true,
		target: "#svelte",
		template
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":"favicon.ico","size":1150,"type":"image/vnd.microsoft.icon"},{"file":"robots.txt","size":67,"type":"text/plain"}],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/website-builder\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/website-builder/__layout.svelte", "src/routes/website-builder/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/ecommerce\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/ecommerce/__layout.svelte", "src/routes/ecommerce/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blogs\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blogs/__layout.svelte", "src/routes/blogs/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blogs\/posts\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blogs/__layout.svelte", "src/routes/blogs/posts/__layout.svelte", "src/routes/blogs/posts/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, render }) => render(request))
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("../../src/routes/__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components/error.svelte"),"src/routes/index.svelte": () => import("../../src/routes/index.svelte"),"src/routes/website-builder/__layout.svelte": () => import("../../src/routes/website-builder/__layout.svelte"),"src/routes/website-builder/index.svelte": () => import("../../src/routes/website-builder/index.svelte"),"src/routes/ecommerce/__layout.svelte": () => import("../../src/routes/ecommerce/__layout.svelte"),"src/routes/ecommerce/index.svelte": () => import("../../src/routes/ecommerce/index.svelte"),"src/routes/blogs/__layout.svelte": () => import("../../src/routes/blogs/__layout.svelte"),"src/routes/blogs/index.svelte": () => import("../../src/routes/blogs/index.svelte"),"src/routes/blogs/posts/__layout.svelte": () => import("../../src/routes/blogs/posts/__layout.svelte"),"src/routes/blogs/posts/index.svelte": () => import("../../src/routes/blogs/posts/index.svelte")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"/./_app/pages/__layout.svelte-f9ba1d39.js","css":["/./_app/assets/pages/__layout.svelte-91fdb9a4.css","/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/__layout.svelte-f9ba1d39.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},".svelte-kit/build/components/error.svelte":{"entry":"/./_app/error.svelte-8856637c.js","css":["/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/error.svelte-8856637c.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},"src/routes/index.svelte":{"entry":"/./_app/pages/index.svelte-51575779.js","css":["/./_app/assets/pages/index.svelte-2154f98b.css","/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/index.svelte-51575779.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},"src/routes/website-builder/__layout.svelte":{"entry":"/./_app/pages/website-builder/__layout.svelte-070129a0.js","css":["/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/website-builder/__layout.svelte-070129a0.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},"src/routes/website-builder/index.svelte":{"entry":"/./_app/pages/website-builder/index.svelte-dfba916d.js","css":["/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/website-builder/index.svelte-dfba916d.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},"src/routes/ecommerce/__layout.svelte":{"entry":"/./_app/pages/ecommerce/__layout.svelte-9b2da551.js","css":["/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/ecommerce/__layout.svelte-9b2da551.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},"src/routes/ecommerce/index.svelte":{"entry":"/./_app/pages/ecommerce/index.svelte-b011c3ae.js","css":["/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/ecommerce/index.svelte-b011c3ae.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},"src/routes/blogs/__layout.svelte":{"entry":"/./_app/pages/blogs/__layout.svelte-47d352e2.js","css":["/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/blogs/__layout.svelte-47d352e2.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},"src/routes/blogs/index.svelte":{"entry":"/./_app/pages/blogs/index.svelte-cc6f832f.js","css":["/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/blogs/index.svelte-cc6f832f.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},"src/routes/blogs/posts/__layout.svelte":{"entry":"/./_app/pages/blogs/posts/__layout.svelte-d1903205.js","css":["/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/blogs/posts/__layout.svelte-d1903205.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null},"src/routes/blogs/posts/index.svelte":{"entry":"/./_app/pages/blogs/posts/index.svelte-d1b1cfb9.js","css":["/./_app/assets/vendor-1405fc18.css"],"js":["/./_app/pages/blogs/posts/index.svelte-d1b1cfb9.js","/./_app/chunks/vendor-4168d81c.js"],"styles":null}};

async function load_component(file) {
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}

init({ paths: {"base":"","assets":"/."} });

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}