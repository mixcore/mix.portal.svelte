const c = [
	() => import("..\\..\\..\\src\\routes\\__layout.svelte"),
	() => import("..\\components\\error.svelte"),
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\database\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\database\\create.svelte"),
	() => import("..\\..\\..\\src\\routes\\database\\draft.svelte"),
	() => import("..\\..\\..\\src\\routes\\module\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\module\\create.svelte"),
	() => import("..\\..\\..\\src\\routes\\module\\draft.svelte"),
	() => import("..\\..\\..\\src\\routes\\about.svelte"),
	() => import("..\\..\\..\\src\\routes\\todos\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\page\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\page\\create.svelte"),
	() => import("..\\..\\..\\src\\routes\\page\\draft.svelte"),
	() => import("..\\..\\..\\src\\routes\\post\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\post\\create.svelte"),
	() => import("..\\..\\..\\src\\routes\\post\\draft.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/database/index.svelte
	[/^\/database\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/database/create.svelte
	[/^\/database\/create\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/database/draft.svelte
	[/^\/database\/draft\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/module/index.svelte
	[/^\/module\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/module/create.svelte
	[/^\/module\/create\/?$/, [c[0], c[7]], [c[1]]],

	// src/routes/module/draft.svelte
	[/^\/module\/draft\/?$/, [c[0], c[8]], [c[1]]],

	// src/routes/about.svelte
	[/^\/about\/?$/, [c[0], c[9]], [c[1]]],

	// src/routes/todos/index.json.ts
	[/^\/todos\.json$/],

	// src/routes/todos/index.svelte
	[/^\/todos\/?$/, [c[0], c[10]], [c[1]]],

	// src/routes/todos/[uid].json.ts
	[/^\/todos\/([^/]+?)\.json$/],

	// src/routes/page/index.svelte
	[/^\/page\/?$/, [c[0], c[11]], [c[1]]],

	// src/routes/page/create.svelte
	[/^\/page\/create\/?$/, [c[0], c[12]], [c[1]]],

	// src/routes/page/draft.svelte
	[/^\/page\/draft\/?$/, [c[0], c[13]], [c[1]]],

	// src/routes/post/index.svelte
	[/^\/post\/?$/, [c[0], c[14]], [c[1]]],

	// src/routes/post/create.svelte
	[/^\/post\/create\/?$/, [c[0], c[15]], [c[1]]],

	// src/routes/post/draft.svelte
	[/^\/post\/draft\/?$/, [c[0], c[16]], [c[1]]]
];

export const fallback = [c[0](), c[1]()];