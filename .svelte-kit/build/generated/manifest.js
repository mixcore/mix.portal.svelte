const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/website-builder/__layout.svelte"),
	() => import("../../../src/routes/website-builder/index.svelte"),
	() => import("../../../src/routes/ecommerce/__layout.svelte"),
	() => import("../../../src/routes/ecommerce/index.svelte"),
	() => import("../../../src/routes/security/__layout.svelte"),
	() => import("../../../src/routes/security/index.svelte"),
	() => import("../../../src/routes/blogs/__layout.svelte"),
	() => import("../../../src/routes/blogs/index.svelte"),
	() => import("../../../src/routes/blogs/posts/__layout.svelte"),
	() => import("../../../src/routes/blogs/posts/index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/website-builder/index.svelte
	[/^\/website-builder\/?$/, [c[0], c[3], c[4]], [c[1]]],

	// src/routes/ecommerce/index.svelte
	[/^\/ecommerce\/?$/, [c[0], c[5], c[6]], [c[1]]],

	// src/routes/security/index.svelte
	[/^\/security\/?$/, [c[0], c[7], c[8]], [c[1]]],

	// src/routes/blogs/index.svelte
	[/^\/blogs\/?$/, [c[0], c[9], c[10]], [c[1]]],

	// src/routes/blogs/posts/index.svelte
	[/^\/blogs\/posts\/?$/, [c[0], c[9], c[11], c[12]], [c[1]]]
];

export const fallback = [c[0](), c[1]()];