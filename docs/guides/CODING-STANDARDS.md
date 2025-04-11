# Mixcore Coding Standards

This document outlines the coding standards and best practices for the Mixcore migration project.

## General Principles

- **Consistency**: Follow established patterns and conventions
- **Simplicity**: Keep code simple and readable
- **Maintainability**: Write code that is easy to maintain and update
- **Performance**: Consider performance implications of code
- **Accessibility**: Ensure UI is accessible to all users

## TypeScript Standards

### Type Definitions

- Use explicit typing for all variables, parameters, and return types
- Create interfaces for component props
- Use type aliases for complex types
- Avoid `any` type when possible

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
function getUser(id): Promise<any> {
  // ...
}
```

### Naming Conventions

- Use `PascalCase` for components, interfaces, and type aliases
- Use `camelCase` for variables, functions, and methods
- Use `UPPER_SNAKE_CASE` for constants

```typescript
// Components
function UserProfile() { /* ... */ }

// Interfaces
interface UserProfileProps { /* ... */ }

// Variables
const userName = 'John';

// Functions
function getUserData() { /* ... */ }

// Constants
const MAX_RETRY_COUNT = 3;
```

### Imports

- Group imports by type
- Keep import statements organized and alphabetized

```typescript
// External libraries
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Hooks and utilities
import { useUser } from '@/hooks/useUser';
import { formatDate } from '@/lib/utils';
```

## React/Next.js Standards

### Component Structure

- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract complex logic into custom hooks
- Use the 'use client' directive only when necessary

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import components
import { Button } from '@/components/ui/button';

// Import hooks and utilities
import { useUser } from '@/hooks/useUser';
import { formatDate } from '@/lib/utils';

// Define props interface
interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  // State hooks
  const [isEditing, setIsEditing] = useState(false);
  
  // Custom hooks
  const { user, loading, error } = useUser(userId);
  const router = useRouter();
  
  // Event handlers
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [userId]);
  
  // Conditional rendering for loading state
  if (loading) return <div>Loading...</div>;
  
  // Conditional rendering for error state
  if (error) return <div>Error: {error.message}</div>;
  
  // Main render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### State Management

- Use React's built-in state management (useState, useReducer) for component-level state
- Use Context API for shared state across multiple components
- Consider Zustand for more complex state management needs

```typescript
// Component-level state
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Context API for shared state
const UserContext = createContext<User | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // Logic to fetch and set user
  
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}
```

### Props

- Destructure props in function parameters
- Provide default values for optional props
- Use appropriate prop types

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}

function Button({
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  children
}: ButtonProps) {
  // Component implementation
}
```

## Tailwind CSS Standards

### Class Organization

- Group related classes
- Order classes logically (layout, spacing, colors, etc.)
- Use consistent order across components

```tsx
// Good
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  {/* Content */}
</div>

// Avoid
<div className="bg-white p-4 flex shadow rounded-lg items-center justify-between">
  {/* Content */}
</div>
```

### Custom Classes

- Use `@apply` in CSS files for reused styles
- Create utility classes for common patterns
- Avoid inline styles

```css
/* In a CSS file */
.card-container {
  @apply flex flex-col p-4 bg-white rounded-lg shadow;
}

.card-header {
  @apply text-lg font-semibold mb-2;
}
```

### Responsive Design

- Use Tailwind's responsive prefixes consistently
- Design for mobile-first, then add responsive classes

```tsx
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/3">
    {/* Sidebar content */}
  </div>
  <div className="w-full md:w-2/3">
    {/* Main content */}
  </div>
</div>
```

## API Integration Standards

### Service Structure

- Create services for each API domain
- Use TypeScript interfaces for request/response types
- Implement proper error handling

```typescript
// types/api/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  // other properties
}

// services/postService.ts
import { apiClient } from './apiClient';
import { Post } from '@/types/api/post';

export const postService = {
  getPosts: async () => {
    try {
      return await apiClient.get<Post[]>('/api/posts');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // other methods
};
```

### Data Fetching

- Use custom hooks for data fetching
- Handle loading and error states
- Implement proper caching where needed

```typescript
// hooks/usePosts.ts
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await postService.getPosts();
        setPosts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);
  
  return { posts, loading, error };
}
```

## Form Handling Standards

- Use React Hook Form for form state management
- Use Zod for form validation
- Create reusable form components

```typescript
// Form schema
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user', 'editor']),
});

// Form component
function UserForm({ onSubmit, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues,
  });
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Other fields */}
      
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Performance Optimization

- Use Next.js built-in image optimization
- Implement code splitting where appropriate
- Lazy-load components that aren't needed immediately
- Avoid unnecessary re-renders

```typescript
// Image optimization
import Image from 'next/image';

function Avatar({ user }) {
  return (
    <Image
      src={user.avatarUrl}
      alt={`${user.name}'s avatar`}
      width={50}
      height={50}
      className="rounded-full"
    />
  );
}

// Lazy loading
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  loading: () => <p>Loading editor...</p>,
  ssr: false,
});
```

## Testing Standards

- Write unit tests for utility functions
- Write component tests for UI components
- Use React Testing Library for component testing
- Mock API calls in tests

```typescript
// Utility function test
describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('January 1, 2023');
  });
});

// Component test
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## Accessibility Standards

- Use semantic HTML elements
- Include proper ARIA attributes where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

```tsx
// Good
<button 
  aria-label="Close dialog"
  onClick={handleClose}
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <XIcon className="h-4 w-4" />
</button>

// Avoid
<div onClick={handleClose}>
  <XIcon className="h-4 w-4" />
</div>
```

## Code Reviews

When submitting code for review:

1. Ensure all TypeScript types are properly defined
2. Verify component props have appropriate types
3. Check that loading and error states are handled
4. Confirm responsive design works on all screen sizes
5. Validate accessibility requirements
6. Make sure code follows project structure and organization

## Documentation

- Add comments for complex logic
- Include JSDoc comments for functions and components
- Update the Component Registry for new components
- Keep API documentation up to date

```typescript
/**
 * Formats a date for display in the UI
 * @param date - The date to format
 * @param format - The format string (default: 'long')
 * @returns The formatted date string
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'long'): string {
  // Implementation
}
``` 