// Type definitions for the blogs mini-app
declare module './components/Dashboard' {
  interface DashboardProps {
    onItemClick: (itemId: string) => void;
  }
  
  export function Dashboard(props: DashboardProps): JSX.Element;
  export default Dashboard;
}

declare module './components/ItemList' {
  interface ItemListProps {
    onItemClick: (itemId: string) => void;
  }
  
  export function ItemList(props: ItemListProps): JSX.Element;
  export default ItemList;
}

declare module './components/ItemDetail' {
  interface ItemDetailProps {
    itemId: string;
    onBack: () => void;
  }
  
  export function ItemDetail(props: ItemDetailProps): JSX.Element;
  export default ItemDetail;
}

declare module './components/BlogPostList' {
  interface BlogPostListProps {
    onItemClick: (itemId: string) => void;
    onCreateClick: () => void;
  }
  
  export function BlogPostList(props: BlogPostListProps): JSX.Element;
}

declare module './components/BlogPostDetail' {
  interface BlogPostDetailProps {
    postId: string;
    onBackClick: () => void;
  }
  
  export function BlogPostDetail(props: BlogPostDetailProps): JSX.Element;
}

// Add event type declarations for custom events
interface CustomEventMap {
  'mixcore:navigation:change': CustomEvent<{
    view: string;
    source: string;
  }>;
}

declare global {
  interface WindowEventMap extends CustomEventMap {}
} 