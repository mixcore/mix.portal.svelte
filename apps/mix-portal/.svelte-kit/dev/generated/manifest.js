const c = [
	() => import("..\\..\\..\\src\\routes\\__layout.svelte"),
	() => import("..\\components\\error.svelte"),
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\account\\__layout.svelte"),
	() => import("..\\..\\..\\src\\routes\\account\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\account\\forgot-password\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\account\\sign-in\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\account\\sign-up\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\install\\__layout.svelte"),
	() => import("..\\..\\..\\src\\routes\\install\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\error\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\cms\\__layout.svelte"),
	() => import("..\\..\\..\\src\\routes\\cms\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\cms\\dashboard\\index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/account/index.svelte
	[/^\/account\/?$/, [c[0], c[3], c[4]], [c[1]]],

	// src/routes/account/forgot-password/index.svelte
	[/^\/account\/forgot-password\/?$/, [c[0], c[3], c[5]], [c[1]]],

	// src/routes/account/sign-in/index.svelte
	[/^\/account\/sign-in\/?$/, [c[0], c[3], c[6]], [c[1]]],

	// src/routes/account/sign-up/index.svelte
	[/^\/account\/sign-up\/?$/, [c[0], c[3], c[7]], [c[1]]],

	// src/routes/install/index.svelte
	[/^\/install\/?$/, [c[0], c[8], c[9]], [c[1]]],

	// src/routes/error/index.svelte
	[/^\/error\/?$/, [c[0], c[10]], [c[1]]],

	// src/routes/cms/index.svelte
	[/^\/cms\/?$/, [c[0], c[11], c[12]], [c[1]]],

	// src/routes/cms/dashboard/index.svelte
	[/^\/cms\/dashboard\/?$/, [c[0], c[11], c[13]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];