'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { appContexts } from '@/constants/data';
import { useNavigationContext } from '@/providers/navigation-context-provider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  enabledContexts: z.array(z.string()),
  defaultContext: z.string().optional()
});

export default function AppContextsSettingsPage() {
  const router = useRouter();
  const { tenantEnabledContexts } = useNavigationContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabledContexts: tenantEnabledContexts || [],
      defaultContext: tenantEnabledContexts?.[0] || undefined
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Save to localStorage for demo purposes
      localStorage.setItem('tenantEnabledContexts', JSON.stringify(values.enabledContexts));
      
      toast.success('App context settings updated successfully');
      
      // Refresh page after a short delay to let the context provider update
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving app context settings:', error);
      toast.error('Failed to update app context settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">App Contexts Settings</h2>
        <p className="text-muted-foreground">
          Manage which app contexts are available in your system
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enabled App Contexts</CardTitle>
                  <CardDescription>
                    Select which app contexts are available in your system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="enabledContexts"
                      render={() => (
                        <FormItem>
                          <div className="grid md:grid-cols-2 gap-4">
                            {appContexts.map((context) => (
                              <FormField
                                key={context.id}
                                control={form.control}
                                name="enabledContexts"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={context.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(context.id)}
                                          onCheckedChange={(checked) => {
                                            const currentValue = [...(field.value || [])];
                                            return checked
                                              ? field.onChange([...currentValue, context.id])
                                              : field.onChange(
                                                  currentValue.filter((value) => value !== context.id)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="font-medium text-base">
                                          {context.name}
                                        </FormLabel>
                                        <FormDescription className="text-sm">
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
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced settings for app contexts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Auto-select default context
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Automatically select the default context for new users
                    </p>
                  </div>
                  <Switch checked={true} aria-readonly />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 