/**
 * ItemList component wrapper for BlogPostList
 * This provides compatibility with the original ItemList component used in the index.tsx
 */
import React from 'react';
import { BlogPostList } from './BlogPostList';

interface ItemListProps {
  onItemClick: (itemId: string) => void;
}

// Re-export BlogPostList as default export
const ItemList = ({ onItemClick }: ItemListProps) => {
  // Map our props to the BlogPostList's expected props
  const handleCreateClick = () => {
    onItemClick('new');
  };

  return <BlogPostList onItemClick={onItemClick} onCreateClick={handleCreateClick} />;
};

export default ItemList; 