'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  Link, 
  Save, 
  Settings, 
  Star, 
  Tag, 
  User,
  Clock,
  CalendarClock,
  PencilLine
} from 'lucide-react';

import { BlogService, BlogPost, BlogCategory, BlogTag, BlogAuthor } from '../lib/blog-service';
import { MixDbApi } from '../lib/mixdb-api';
import { AuthService } from '../lib/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface BlogPostDetailProps {
  postId: string;
  onBackClick: () => void;
}

export function BlogPostDetail({ postId, onBackClick }: BlogPostDetailProps) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [selectedTab, setSelectedTab] = useState('editor');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Initialize blog service
  const api = new MixDbApi({
    apiBasePath: '/api/v2/mixdb',
    culture: 'en-US'
  });
  const authService = new AuthService();
  const blogService = new BlogService(api, authService);
  
  // Load post and reference data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load post
        if (postId !== 'new') {
          const postData = await blogService.getPostById(postId);
          setPost(postData);
          setOriginalPost(JSON.parse(JSON.stringify(postData))); // Deep copy
        } else {
          // Create new post template
          const newPost: Partial<BlogPost> = {
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            status: 'draft',
            authorId: '',
            categoryIds: [],
            tagIds: [],
            isFeatured: false,
            readTime: 0
          };
          setPost(newPost as BlogPost);
          setOriginalPost(JSON.parse(JSON.stringify(newPost))); // Deep copy
        }
        
        // Load categories
        const categoriesResult = await blogService.getCategories();
        setCategories(categoriesResult.items);
        
        // Load tags
        const tagsResult = await blogService.getTags();
        setTags(tagsResult.items);
        
        // Load authors
        const authorsResult = await blogService.getAuthors();
        setAuthors(authorsResult.items);
      } catch (error) {
        console.error('Error loading blog post data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [postId]);
  
  // Handle field changes
  const handleChange = (field: keyof BlogPost, value: any) => {
    if (!post) return;
    
    // If changing title and slug is empty or matching the original title-derived slug,
    // update the slug as well
    if (field === 'title' && 
        (!post.slug || (originalPost && post.slug === createSlug(originalPost.title)))) {
      setPost({
        ...post,
        [field]: value,
        slug: createSlug(value as string)
      });
    } else {
      setPost({
        ...post,
        [field]: value
      });
    }
    
    // Clear success message when editing
    if (success) {
      setSuccess(false);
    }
  };
  
  // Create slug from title
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };
  
  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    if (!post) return;
    
    const currentTags = post.tagIds || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    handleChange('tagIds', newTags);
  };
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    if (!post) return;
    
    const currentCategories = post.categoryIds || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    handleChange('categoryIds', newCategories);
  };
  
  // Check if post has been modified
  const isPostModified = () => {
    if (!post || !originalPost) return false;
    
    // Compare serialized versions for deep comparison
    return JSON.stringify(post) !== JSON.stringify(originalPost);
  };
  
  // Handle save
  const handleSave = async () => {
    if (!post) return;
    
    try {
      setSaving(true);
      setSaveError(null);
      
      if (postId === 'new') {
        // Create new post
        const newPost = await blogService.createPost(post);
        setPost(newPost);
        setOriginalPost(JSON.parse(JSON.stringify(newPost))); // Deep copy
      } else {
        // Update existing post
        const updatedPost = await blogService.updatePost(postId, post);
        setPost(updatedPost);
        setOriginalPost(JSON.parse(JSON.stringify(updatedPost))); // Deep copy
      }
      
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving blog post:', error);
      setSaveError('Failed to save the blog post. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle publish
  const handlePublish = async () => {
    if (!post) return;
    
    try {
      setSaving(true);
      setSaveError(null);
      
      // First save any changes
      let currentPost = post;
      if (isPostModified()) {
        if (postId === 'new') {
          currentPost = await blogService.createPost(post);
        } else {
          currentPost = await blogService.updatePost(postId, post);
        }
      }
      
      // Then publish
      const publishedPost = await blogService.publishPost(currentPost.id);
      setPost(publishedPost);
      setOriginalPost(JSON.parse(JSON.stringify(publishedPost))); // Deep copy
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error publishing blog post:', error);
      setSaveError('Failed to publish the blog post. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Scheduled</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Find category by ID
  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };
  
  // Find tag by ID
  const getTagById = (id: string) => {
    return tags.find(tag => tag.id === id);
  };
  
  // Find author by ID
  const getAuthorById = (id: string) => {
    return authors.find(author => author.id === id);
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={onBackClick} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
        <div className="h-12 w-full bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-12 w-full bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={onBackClick} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Post Not Found</h1>
        </div>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The requested blog post could not be found. It may have been deleted or you may not have permission to view it.
          </AlertDescription>
        </Alert>
        <Button onClick={onBackClick}>
          Go Back to Posts
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={onBackClick} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {postId === 'new' ? 'Create New Post' : 'Edit Post'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {post.status && getStatusBadge(post.status)}
              {post.publishedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Published: {formatDate(post.publishedDate)}
                </span>
              )}
              {post.createdBy && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  By: {post.createdBy}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {post.status !== 'published' && (
            <Button 
              variant="default" 
              onClick={handlePublish}
              disabled={saving || !post.title || !post.content || !post.authorId}
            >
              <Eye className="mr-2 h-4 w-4" />
              Publish
            </Button>
          )}
          
          <Button 
            variant={post.status === 'published' ? 'default' : 'outline'} 
            onClick={handleSave}
            disabled={saving || !isPostModified() || !post.title}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Post Options</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedTab('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Post Settings
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={post.isFeatured ? 'text-amber-500' : ''}
                onClick={() => handleChange('isFeatured', !post.isFeatured)}
              >
                <Star className={`mr-2 h-4 w-4 ${post.isFeatured ? 'fill-amber-500' : ''}`} />
                {post.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Success message */}
      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            {postId === 'new' ? 'Blog post created successfully!' : 'Blog post updated successfully!'}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Error message */}
      {saveError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <PencilLine className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-6 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={post.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter post title"
              className="text-xl font-medium"
            />
          </div>
          
          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                /blog/
              </span>
              <Input
                id="slug"
                value={post.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="url-friendly-post-name"
                className="rounded-l-none"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              The URL-friendly version of the title. Automatically generated from the title if left blank.
            </p>
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={post.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Write your post content here..."
              className="min-h-[300px]"
            />
          </div>
          
          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={post.excerpt || ''}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="A brief summary of your post (optional)"
              className="h-24"
            />
            <p className="text-sm text-muted-foreground">
              A short summary of your post. If not provided, an excerpt will be automatically generated from the content.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main settings column */}
            <div className="md:col-span-2 space-y-6">
              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {post.featuredImage ? (
                    <div className="relative">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title} 
                        className="w-full h-[200px] object-cover rounded-md" 
                      />
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={() => handleChange('featuredImage', '')}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-md p-12 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-2 text-lg font-medium">No featured image</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Upload an image or enter an image URL</p>
                      <div className="mt-4">
                        <Input
                          placeholder="Enter image URL"
                          onChange={(e) => handleChange('featuredImage', e.target.value)}
                          className="max-w-md mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={post.metaTitle || ''}
                      onChange={(e) => handleChange('metaTitle', e.target.value)}
                      placeholder="SEO title (optional)"
                    />
                    <p className="text-xs text-muted-foreground">
                      If left blank, the post title will be used.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={post.metaDescription || ''}
                      onChange={(e) => handleChange('metaDescription', e.target.value)}
                      placeholder="SEO description (optional)"
                      className="h-20"
                    />
                    <p className="text-xs text-muted-foreground">
                      If left blank, the post excerpt will be used.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar settings */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status & Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={post.status} 
                      onValueChange={(value) => handleChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select post status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isFeatured">Featured Post</Label>
                    <Switch 
                      id="isFeatured" 
                      checked={post.isFeatured} 
                      onCheckedChange={(checked) => handleChange('isFeatured', checked)}
                    />
                  </div>
                  
                  {post.status === 'scheduled' && (
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">Scheduled Date</Label>
                      <Input 
                        id="scheduledDate"
                        type="datetime-local"
                        value={post.scheduledDate?.slice(0, 16) || ''}
                        onChange={(e) => handleChange('scheduledDate', e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time (minutes)</Label>
                    <Input 
                      id="readTime"
                      type="number"
                      value={post.readTime || 0}
                      onChange={(e) => handleChange('readTime', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Author */}
              <Card>
                <CardHeader>
                  <CardTitle>Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={post.authorId || ''} 
                    onValueChange={(value) => handleChange('authorId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={(post.categoryIds || []).includes(category.id)}
                            onChange={() => handleCategorySelect(category.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                            {category.name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No categories found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`tag-${tag.id}`}
                            checked={(post.tagIds || []).includes(tag.id)}
                            onChange={() => handleTagSelect(tag.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor={`tag-${tag.id}`} className="text-sm cursor-pointer">
                            {tag.name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 