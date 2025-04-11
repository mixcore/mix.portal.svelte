'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, LayoutGridIcon } from 'lucide-react';

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup } from '@/components/ui/radio-group';

// Form validation with react-hook-form and zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Tenant form schema
const tenantFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Tenant name must be at least 2 characters.',
  }),
  domain: z.string().min(3, {
    message: 'Domain must be at least 3 characters.',
  }).refine(val => /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(val) || /^[a-zA-Z0-9-]+$/.test(val), {
    message: 'Please enter a valid domain format.',
  }),
  plan: z.string({
    required_error: 'Please select a plan.',
  }),
  contactName: z.string().min(2, {
    message: 'Contact name must be at least 2 characters.',
  }),
  contactEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  contactPhone: z.string().optional(),
  initialUsers: z.number().int().min(1, {
    message: 'At least 1 user is required.',
  }).max(100, {
    message: 'Maximum 100 initial users allowed.',
  }),
  billingMode: z.enum(['monthly', 'yearly'], {
    required_error: 'Please select a billing mode.',
  }),
  isCustomBranding: z.boolean().default(false),
  isMultiRegion: z.boolean().default(false),
  enabledContexts: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

export default function NewTenantPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  
  // Add app contexts data
  const [availableAppContexts] = useState([
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
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: '',
      domain: '',
      plan: 'basic',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      initialUsers: 5,
      billingMode: 'monthly',
      isCustomBranding: false,
      isMultiRegion: false,
      enabledContexts: [],
      notes: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: TenantFormValues) => {
    try {
      setIsLoading(true);
      
      // This would be an API call in the real implementation
      console.log('Creating tenant with data:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Tenant created successfully',
      });
      
      router.push('/dashboard/tenants');
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tenant',
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
        onConfirm={() => router.push('/dashboard/tenants')}
        loading={isLoading}
        title="Cancel tenant creation"
        description="Are you sure you want to cancel? Any unsaved changes will be lost."
      />
      
      <div className="px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/dashboard/tenants')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Heading
              title="Create New Tenant"
              description="Add a new tenant to your multi-tenant environment"
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
              {isLoading ? 'Creating...' : 'Create Tenant'}
            </Button>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tenant Details</CardTitle>
                    <CardDescription>
                      Basic information about the tenant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tenant Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Acme Corporation"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            The official name of the tenant organization
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domain</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="acme-corp.example.com"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            The unique domain for tenant access
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="plan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subscription Plan</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The subscription plan for this tenant
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="initialUsers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Initial Users</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={100}
                                {...field}
                                value={field.value === 0 ? '' : field.value}
                                onChange={event => field.onChange(event.target.value === '' ? 0 : parseInt(event.target.value, 10))}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormDescription>
                              Number of initial user licenses
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="billingMode"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Billing Cycle</FormLabel>
                          <FormControl>
                            <div className="flex flex-col space-y-1">
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <input 
                                    type="radio" 
                                    className="size-4 text-primary border-primary" 
                                    value="monthly"
                                    checked={field.value === "monthly"}
                                    onChange={() => field.onChange("monthly")}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Monthly (Standard rate)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <input 
                                    type="radio" 
                                    className="size-4 text-primary border-primary" 
                                    value="yearly"
                                    checked={field.value === "yearly"}
                                    onChange={() => field.onChange("yearly")}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yearly (20% discount)
                                </FormLabel>
                              </FormItem>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Primary contact for this tenant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John Doe"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="john.doe@example.com"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="+1 (555) 123-4567"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar Column */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="isCustomBranding"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Custom Branding
                            </FormLabel>
                            <FormDescription>
                              Allow this tenant to use custom branding and themes
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isMultiRegion"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Multi-Region Deployment
                            </FormLabel>
                            <FormDescription>
                              Deploy tenant data across multiple geographic regions
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Internal)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any additional notes about this tenant..."
                              className="min-h-[100px]"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            These notes are for internal use only
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {form.watch('plan') === 'basic' && (
                        <>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Up to 10 users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Basic features</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Email support</span>
                          </div>
                        </>
                      )}
                      
                      {form.watch('plan') === 'professional' && (
                        <>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Up to 50 users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Advanced features</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Priority support</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">API access</span>
                          </div>
                        </>
                      )}
                      
                      {form.watch('plan') === 'enterprise' && (
                        <>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Unlimited users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">All features</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">24/7 premium support</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Advanced API access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Dedicated account manager</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
} 