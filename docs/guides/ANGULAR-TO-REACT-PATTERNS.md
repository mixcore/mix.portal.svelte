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
  import { createForm } from 'svelte-forms-lib';
  
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

// Using the store in a component:
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

## Routing Patterns

### AngularJS Route Configuration

```javascript
angular.module('app').config(function($routeProvider) {
  $routeProvider
    .when('/posts', {
      templateUrl: 'posts/list.html',
      controller: 'PostsController'
    })
    .when('/posts/:id', {
      templateUrl: 'posts/detail.html',
      controller: 'PostDetailController'
    })
    .otherwise({
      redirectTo: '/posts'
    });
});
```

### Next.js App Router

Next.js uses file-based routing with the App Router:

```
src/app/
├── posts/
│   ├── page.tsx       # /posts route
│   └── [id]/
│       └── page.tsx   # /posts/:id route
├── layout.tsx
└── not-found.tsx      # 404 fallback
```

```tsx
// src/app/posts/page.tsx
export default function PostsPage() {
  // Fetch and display posts
  return (
    <div>
      <h1>Posts</h1>
      {/* Posts list */}
    </div>
  );
}

// src/app/posts/[id]/page.tsx
export default function PostDetailPage({ params }: { params: { id: string } }) {
  // Access id from params and fetch post
  return (
    <div>
      <h1>Post {params.id}</h1>
      {/* Post details */}
    </div>
  );
}
```

## Conditional Rendering

### AngularJS Conditional Rendering

```html
<div ng-if="isLoggedIn">
  Welcome, {{user.name}}
</div>
<div ng-if="!isLoggedIn">
  Please log in
</div>

<ul>
  <li ng-repeat="item in items">
    {{item.name}}
  </li>
</ul>

<div ng-show="isVisible">This is visible</div>
```

### React/Next.js Conditional Rendering

```tsx
{isLoggedIn ? (
  <div>Welcome, {user.name}</div>
) : (
  <div>Please log in</div>
)}

<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>

{isVisible && <div>This is visible</div>}
```

## State Management Patterns

### AngularJS State Service

```javascript
angular.module('app').service('StateService', function() {
  this.currentUser = null;
  
  this.setCurrentUser = function(user) {
    this.currentUser = user;
  };
  
  this.isLoggedIn = function() {
    return !!this.currentUser;
  };
});
```

### React Context API

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        setUser,
        isLoggedIn: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## Event Handling Patterns

### AngularJS Event Handling

```html
<button ng-click="handleClick($event)">Click me</button>
<input ng-change="handleChange()" ng-model="inputValue" />
```

```javascript
$scope.handleClick = function(event) {
  console.log('Button clicked', event);
};

$scope.handleChange = function() {
  console.log('Input changed', $scope.inputValue);
};
```

### React/Next.js Event Handling

```tsx
function MyComponent() {
  const [inputValue, setInputValue] = useState('');
  
  const handleClick = (event: React.MouseEvent) => {
    console.log('Button clicked', event);
  };
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    console.log('Input changed', event.target.value);
  };
  
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <input
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}
```

## Lifecycle Method Patterns

### AngularJS Lifecycle Hooks

```javascript
angular.module('app').controller('MyController', function($scope) {
  $scope.$onInit = function() {
    console.log('Component initialized');
  };
  
  $scope.$onChanges = function(changes) {
    console.log('Props changed', changes);
  };
  
  $scope.$onDestroy = function() {
    console.log('Component destroyed');
  };
});
```

### React/Next.js Lifecycle with useEffect

```tsx
import { useEffect, useState } from 'react';

function MyComponent({ id }) {
  const [data, setData] = useState(null);
  
  // On mount (similar to $onInit)
  useEffect(() => {
    console.log('Component mounted');
    
    // Cleanup function (similar to $onDestroy)
    return () => {
      console.log('Component unmounted');
    };
  }, []);
  
  // On prop change (similar to $onChanges)
  useEffect(() => {
    console.log('ID prop changed', id);
    fetchData(id);
  }, [id]);
  
  const fetchData = async (id) => {
    // Fetch data with the ID
  };
  
  return <div>{/* Component JSX */}</div>;
}
```

## Migration Strategy Tips

1. **Start with stateless components**: Begin with simpler components that don't manage complex state
2. **Migrate services to hooks**: Convert Angular services to React hooks and API services
3. **Use React context for global state**: Replace Angular services used for global state with React Context
4. **Leverage TypeScript**: Add strong typing to improve code quality and catch errors
5. **Implement one feature at a time**: Complete the migration of one feature before moving to the next
6. **Rewrite templates in JSX**: Convert Angular templates to JSX, adapting directives to React patterns
7. **Test thoroughly**: Ensure the migrated components work as expected before proceeding 