# AngularJS to Svelte/SvelteKit Migration Patterns

This guide provides essential patterns and equivalents when migrating components from AngularJS to Svelte/SvelteKit.

## Core Concept Mapping

| AngularJS | Svelte/SvelteKit | Notes |
|-----------|------------------|-------|
| Modules | Files/Directories | Svelte uses file-based organization |
| Controllers | Components | Svelte components (.svelte files) |
| Templates | Svelte Markup | Templates are part of .svelte files |
| Scope | Props & Reactive Variables | Component props and reactive variables |
| Two-way Binding | Two-way Binding | Svelte supports two-way binding with bind: |
| Services | Stores | Services become stores or utility modules |
| Directives | Components, Actions | Custom components and actions |
| Filters | Helper Functions | Pure functions for data transformation |

## Component Patterns

### Basic Component

#### AngularJS Component

```javascript
angular.module('app').component('userProfile', {
  templateUrl: 'user-profile.html',
  controller: function($scope, UserService) {
    $scope.user = {};
    
    UserService.getUser().then(function(user) {
      $scope.user = user;
    });
    
    $scope.updateUser = function() {
      UserService.updateUser($scope.user);
    };
  }
});
```

```html
<!-- user-profile.html -->
<div class="user-profile">
  <h2>{{user.name}}</h2>
  <p>{{user.email}}</p>
  <button ng-click="updateUser()">Update</button>
</div>
```

#### Svelte Component

```svelte
<!-- UserProfile.svelte -->
<script>
  import { onMount } from 'svelte';
  import { userStore } from '$lib/stores/userStore';

  let user = {};
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      user = await userStore.getUser();
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  });

  async function updateUser() {
    await userStore.updateUser(user);
  }
</script>

{#if loading}
  <div>Loading...</div>
{:else if error}
  <div>Error: {error.message}</div>
{:else}
  <div class="user-profile">
    <h2>{user.name}</h2>
    <p>{user.email}</p>
    <button on:click={updateUser}>Update</button>
  </div>
{/if}
```

## Data Binding Patterns

### Form Input Binding

#### AngularJS Form Binding

```html
<form ng-submit="submitForm()">
  <input type="text" ng-model="user.name" />
  <input type="email" ng-model="user.email" />
  <button type="submit">Save</button>
</form>
```

```javascript
$scope.submitForm = function() {
  UserService.saveUser($scope.user);
};
```

#### Svelte Form Binding

```svelte
<script>
  let user = { name: '', email: '' };
  
  function handleSubmit() {
    // Save user
    onSave(user);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input
    type="text"
    bind:value={user.name}
  />
  <input
    type="email"
    bind:value={user.email}
  />
  <button type="submit">Save</button>
</form>
```

### Svelte Forms Lib Implementation

For more complex forms, use Svelte Forms Lib:

```svelte
<script>
  import { createForm } from 'svelte-forms-lib';
  import { z } from 'zod';
  import { toFormValidator } from 'zod-form-data';
  
  const userSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email format'),
  });
  
  const { form, errors, handleChange, handleSubmit } = createForm({
    initialValues: {
      name: '',
      email: '',
    },
    validate: toFormValidator(userSchema),
    onSubmit: values => {
      onSave(values);
    }
  });
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div>
    <input 
      name="name"
      type="text"
      value={$form.name}
      on:change={handleChange}
    />
    {#if $errors.name}
      <p>{$errors.name}</p>
    {/if}
  </div>
  <div>
    <input 
      name="email"
      type="email"
      value={$form.email}
      on:change={handleChange}
    />
    {#if $errors.email}
      <p>{$errors.email}</p>
    {/if}
  </div>
  <button type="submit">Save</button>
</form>
```

## Service to Store Patterns

### API Service

#### AngularJS Service

```javascript
angular.module('app').service('PostService', function($http) {
  this.getPosts = function() {
    return $http.get('/api/posts');
  };
  
  this.getPost = function(id) {
    return $http.get('/api/posts/' + id);
  };
  
  this.createPost = function(post) {
    return $http.post('/api/posts', post);
  };
});
```

#### Svelte Store + Fetch API

```typescript
// stores/postStore.ts
import { writable, derived } from 'svelte/store';

export interface Post {
  id: string;
  title: string;
  content: string;
}

function createPostStore() {
  const { subscribe, set, update } = writable<{
    posts: Post[];
    loading: boolean;
    error: Error | null;
  }>({
    posts: [],
    loading: false,
    error: null
  });
  
  return {
    subscribe,
    getPosts: async () => {
      update(state => ({ ...state, loading: true }));
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        update(state => ({ ...state, posts, loading: false, error: null }));
        return posts;
      } catch (error) {
        update(state => ({ 
          ...state, 
          loading: false, 
          error: error instanceof Error ? error : new Error(String(error))
        }));
        throw error;
      }
    },
    
    getPost: async (id: string) => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        return await response.json();
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    createPost: async (post: Omit<Post, 'id'>) => {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(post),
        });
        if (!response.ok) throw new Error('Failed to create post');
        const newPost = await response.json();
        update(state => ({
          ...state,
          posts: [...state.posts, newPost]
        }));
        return newPost;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

export const postStore = createPostStore();
```

## Using the store in a component:

```svelte
<script>
  import { onMount } from 'svelte';
  import { postStore } from '$lib/stores/postStore';
  
  let unsubscribe;
  let posts = [];
  let loading = true;
  let error = null;
  
  onMount(() => {
    unsubscribe = postStore.subscribe(state => {
      posts = state.posts;
      loading = state.loading;
      error = state.error;
    });
    
    // Initial fetch
    postStore.getPosts();
    
    return () => {
      unsubscribe();
    };
  });
</script>

{#if loading}
  <div>Loading posts...</div>
{:else if error}
  <div>Error: {error.message}</div>
{:else}
  <ul>
    {#each posts as post}
      <li>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </li>
    {/each}
  </ul>
{/if}
```

## SvelteKit Routing

SvelteKit uses file-based routing:

```
routes/
├── +layout.svelte       # Main layout for all pages
├── +page.svelte         # Home page
├── about/
│   └── +page.svelte     # /about page
├── blog/
│   ├── +page.svelte     # /blog page (index)
│   └── [slug]/          # Dynamic route
│       └── +page.svelte # /blog/:slug page
└── api/                 # API routes
    └── posts/
        └── +server.js   # /api/posts endpoint
```

## SvelteKit Data Loading

SvelteKit uses load functions to fetch data:

```svelte
<!-- routes/blog/[slug]/+page.svelte -->
<script>
  export let data; // Data from load function
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```

```javascript
// routes/blog/[slug]/+page.server.js
export async function load({ params }) {
  const { slug } = params;
  const post = await fetchPost(slug);
  
  if (!post) {
    throw error(404, 'Post not found');
  }
  
  return { post };
}
```

## SvelteKit Event Handling

```svelte
<script>
  function handleClick(event) {
    console.log('Clicked!', event);
  }
  
  function handleInput(event) {
    console.log('Input value:', event.target.value);
  }
</script>

<button on:click={handleClick}>Click me</button>
<input on:input={handleInput} />
```

## SvelteKit Context API

```svelte
<!-- lib/contexts/ThemeContext.svelte -->
<script>
  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  
  export let initialTheme = 'light';
  
  const THEME_KEY = 'theme';
  const theme = writable(initialTheme);
  
  setContext(THEME_KEY, {
    theme,
    toggleTheme: () => theme.update(t => t === 'light' ? 'dark' : 'light')
  });
</script>

<slot />
```

Using the context:

```svelte
<script>
  import { getContext } from 'svelte';
  
  const { theme, toggleTheme } = getContext('theme');
</script>

<div class="app" class:dark={$theme === 'dark'}>
  <button on:click={toggleTheme}>
    Toggle theme (current: {$theme})
  </button>
  <slot />
</div>
```

## Migration Approach

1. **Start with components**: Begin by migrating individual components from AngularJS to Svelte
2. **Migrate services to stores**: Convert Angular services to Svelte stores
3. **Use Svelte context for global state**: Replace Angular services used for global state with Svelte context
4. **Build page by page**: Convert one route/page at a time, testing thoroughly
5. **Create a compatibility layer**: If needed, build a layer that allows Svelte components to work in the AngularJS app during transition
6. **Rewrite templates in Svelte markup**: Convert Angular templates to Svelte markup, using Svelte's template syntax

Remember, unlike React's JSX, Svelte uses a more HTML-like syntax with special tags for control flow ({#if}, {#each}, etc.). 