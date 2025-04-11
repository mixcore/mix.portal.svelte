'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronLeft, ChevronDown, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { MixContentStatus } from '@/types/content';

export default function NewPagePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<MixContentStatus>(MixContentStatus.Draft);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  
  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-generate slug if user hasn't manually modified it
    if (!slug || slug === createSlug(title)) {
      setSlug(createSlug(newTitle));
    }
  };
  
  // Create slug from string
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
      .trim();
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug) {
      toast({
        title: 'Error',
        description: 'Title and slug are required',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // This would be an API call in the real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Page created successfully',
      });
      
      router.push('/dashboard/pages');
    } catch (error) {
      console.error('Error creating page:', error);
      toast({
        title: 'Error',
        description: 'Failed to create page',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <AlertModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={() => router.push('/dashboard/pages')}
        loading={isLoading}
        title="Cancel page creation"
        description="Are you sure you want to cancel? Any unsaved changes will be lost."
      />
      
      <div className="px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/dashboard/pages')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Heading
              title="Create New Page"
              description="Add a new page to your website"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => setIsCancelOpen(true)}
            >
              Cancel
            </Button>
            <Button 
              disabled={!title || !slug || isLoading} 
              onClick={handleSubmit}
            >
              {isLoading ? 'Creating...' : 'Create Page'}
            </Button>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <form className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Page Content</CardTitle>
                  <CardDescription>
                    The main content for your page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Page Title"
                        value={title}
                        onChange={handleTitleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="slug"
                          placeholder="page-slug"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The URL-friendly version of the page title
                      </p>
                    </div>
                    
                    <Tabs defaultValue="editor">
                      <TabsList className="mb-2">
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>
                      <TabsContent value="editor">
                        <div className="space-y-2">
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            placeholder="Page content..."
                            className="min-h-[300px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="preview" className="min-h-[300px] p-4 border rounded-md">
                        {content ? (
                          <div className="prose max-w-none">
                            {/* Would use a Markdown renderer here in a real implementation */}
                            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-10">
                            Content preview will appear here
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Page Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status.toString()}
                      onValueChange={(value) => setStatus(Number(value) as MixContentStatus)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MixContentStatus.Draft.toString()}>
                          Draft
                        </SelectItem>
                        <SelectItem value={MixContentStatus.Published.toString()}>
                          Published
                        </SelectItem>
                        <SelectItem value={MixContentStatus.Archived.toString()}>
                          Archived
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="outline"
                      onClick={() => setStatus(MixContentStatus.Draft)}
                    >
                      Save Draft
                    </Button>
                    <Button
                      onClick={() => {
                        setStatus(MixContentStatus.Published);
                        handleSubmit(new Event('click') as unknown as React.FormEvent);
                      }}
                    >
                      Publish
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Meta Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible defaultValue="excerpt">
                    <AccordionItem value="excerpt">
                      <AccordionTrigger>Excerpt</AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 space-y-2">
                          <Textarea
                            placeholder="Brief description of the page..."
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <p className="text-xs text-muted-foreground">
                            A short summary displayed in search results and page listings
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="seo">
                      <AccordionTrigger>SEO</AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="meta-title">Meta Title</Label>
                            <Input
                              id="meta-title"
                              placeholder="SEO Title"
                              defaultValue={title}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="meta-description">Meta Description</Label>
                            <Textarea
                              id="meta-description"
                              placeholder="SEO Description"
                              defaultValue={excerpt}
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </>
  );
} 