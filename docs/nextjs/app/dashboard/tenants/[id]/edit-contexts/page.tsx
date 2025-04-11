'use client';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // This is a placeholder - in production you'd want to specify actual IDs
  return [
    { edit-contexts: 'demo-1' },
    { edit-contexts: 'demo-2' }
  ];
}


import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Check, LayoutGridIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

// App context edit form schema
const appContextsFormSchema = z.object({
  enabledContexts: z.array(z.string()),
});

type AppContextFormValues = z.infer<typeof appContextsFormSchema>;

interface AppContext {
  id: string;
  name: string;
  description: string;
}

export default function EditAppContextsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  
  // App contexts (pulled from the actual config in the main app)
  const [availableAppContexts] = useState<AppContext[]>([
    { id: 'website', name: 'Website', description: 'Website, eCommerce and online content' },
    { id: 'sales', name: 'Sales', description: 'CRM, Sales and Point of Sale' },
    { id: 'finance', name: 'Finance', description: 'Accounting, Invoicing and Documents' },
    { id: 'inventory', name: 'Inventory', description: 'Inventory & Manufacturing' },
    { id: 'hr', name: 'HR', description: 'Human Resources management' },
    { id: 'marketing', name: 'Marketing', description: 'Marketing campaigns and Events' },
    { id: 'services', name: 'Services', description: 'Projects, Timesheet and Helpdesk' },
    { id: 'productivity', name: 'Productivity', description: 'Discuss, Approvals and Knowledge' },
    { id: 'customization', name: 'Customization', description: 'Studio and app customization' }
  ]);
  
  // Define form with react-hook-form
  const form = useForm<AppContextFormValues>({
    resolver: zodResolver(appContextsFormSchema),
    defaultValues: {
      enabledContexts: [],
    },
  });
  
  // Load tenant data
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        // In a real app, we would fetch the tenant data from API
        // For this demo, we'll mock the data
        
        // Mock tenant's enabled contexts
        const mockEnabledContexts = ['website', 'sales', 'finance', 'hr'];
        
        // If this is tenant ID 2 (a different tenant), use different contexts
        if (id === '2') {
          mockEnabledContexts.length = 0;
          mockEnabledContexts.push('website', 'inventory', 'productivity');
        }
        
        form.reset({
          enabledContexts: mockEnabledContexts,
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tenant information',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    fetchTenantData();
  }, [id, form, toast]);
  
  // Handle form submission
  const onSubmit = async (values: AppContextFormValues) => {
    try {
      setIsLoading(true);
      
      // This would be an API call in a real implementation
      console.log('Updating app contexts for tenant:', id, values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'App contexts updated successfully',
      });
      
      router.push(`/dashboard/tenants/${id}`);
    } catch (error) {
      console.error('Error updating tenant app contexts:', error);
      toast({
        title: 'Error',
        description: 'Failed to update app contexts',
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
        onConfirm={() => router.push(`/dashboard/tenants/${id}`)}
        loading={isLoading}
        title="Cancel changes"
        description="Are you sure you want to cancel? Any unsaved changes will be lost."
      />
      
      <div className="px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push(`/dashboard/tenants/${id}`)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Heading
              title="Edit App Contexts"
              description="Configure which app contexts are enabled for this tenant"
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
              disabled={isLoading} 
              onClick={form.handleSubmit(onSubmit)}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutGridIcon className="h-5 w-5" />
                  Available App Contexts
                </CardTitle>
                <CardDescription>
                  Enable or disable app contexts for this tenant. Users will only see navigation items from enabled contexts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="enabledContexts"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">App Contexts</FormLabel>
                        <FormDescription>
                          Select which app contexts should be available for this tenant
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableAppContexts.map((context) => (
                          <FormField
                            key={context.id}
                            control={form.control}
                            name="enabledContexts"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={context.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(context.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValues = [...field.value || []];
                                        
                                        if (checked) {
                                          // Add the value if it's not already in the array
                                          if (!currentValues.includes(context.id)) {
                                            field.onChange([...currentValues, context.id]);
                                          }
                                        } else {
                                          // Remove the value if it's in the array
                                          field.onChange(
                                            currentValues.filter((value) => value !== context.id)
                                          );
                                        }
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">
                                      {context.name}
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                      {context.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => setIsCancelOpen(true)}
                >
                  Cancel
                </Button>
                <Button 
                  disabled={isLoading} 
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
} 