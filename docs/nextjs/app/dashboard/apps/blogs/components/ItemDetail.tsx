/**
 * ItemDetail component wrapper for BlogPostDetail
 * This provides compatibility with the original ItemDetail component used in the index.tsx
 */
import { BlogPostDetail } from './BlogPostDetail';

// Re-export BlogPostDetail as a wrapper component with renamed props
const ItemDetail = ({ 
  itemId, 
  onBack 
}: { 
  itemId: string; 
  onBack: () => void;
}) => {
  // Map our props to the BlogPostDetail's expected props
  return <BlogPostDetail postId={itemId} onBackClick={onBack} />;
};

export default ItemDetail; 