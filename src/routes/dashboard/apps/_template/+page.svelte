<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    // UI Components
    import { Button } from '$components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$components/ui/card';
    import { Input } from '$components/ui/input';
    import { Label } from '$components/ui/label';
    import { Switch } from '$components/ui/switch';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
    import { Separator } from '$components/ui/separator';
    
    // Store
    import { miniAppRegistry } from '$lib/mini-app/MiniAppRegistry';
    
    // Mini-app metadata
    const APP_ID = 'template';
    const APP_NAME = 'Template App';
    const APP_VERSION = '1.0.0';
    
    // Demo state
    let counter = 0;
    let darkMode = false;
    let name = '';
    let activeTab = 'overview';
    
    // Mini-app lifecycle
    onMount(() => {
        if (!browser) return;
        
        // Register this mini-app
        miniAppRegistry.registerApp({
            id: APP_ID,
            name: APP_NAME,
            version: APP_VERSION,
            config: {
                url: '/dashboard/apps/_template',
                supportsDarkMode: true
            }
        });
        
        // Set as active app
        miniAppRegistry.setActiveApp(APP_ID);
        
        // Initialize from registry if needed
        const appData = miniAppRegistry.getAppData(APP_ID);
        if (appData) {
            counter = appData.counter || 0;
            name = appData.name || '';
        }
    });
    
    onDestroy(() => {
        if (!browser) return;
        
        // Save app state
        miniAppRegistry.updateAppData(APP_ID, {
            counter,
            name,
            lastUsed: new Date().toISOString()
        });
    });
    
    // Increment counter function
    function incrementCounter() {
        counter++;
    }
    
    // Reset counter function
    function resetCounter() {
        counter = 0;
    }
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="space-y-6">
        <header class="space-y-2">
            <h1 class="text-3xl font-bold tracking-tight">Template Mini-App</h1>
            <p class="text-muted-foreground">A template for creating Mixcore mini-apps</p>
        </header>
        
        <Tabs bind:value={activeTab} class="w-full">
            <TabsList class="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" class="space-y-6 pt-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card class="col-span-2">
                        <CardHeader>
                            <CardTitle>Welcome to the Template App</CardTitle>
                            <CardDescription>This is a starting point for creating your own mini-apps</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>This template demonstrates how to build a mini-app for the Mixcore portal. It includes:</p>
                            <ul class="list-disc pl-6 mt-4 space-y-2">
                                <li>Mini-app registration with the portal</li>
                                <li>State persistence between sessions</li>
                                <li>UI components from the shared library</li>
                                <li>Tabs for organizing content</li>
                                <li>Basic interactive elements</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <p class="text-sm text-muted-foreground">Version {APP_VERSION}</p>
                        </CardFooter>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Demo Counter</CardTitle>
                            <CardDescription>Try the interactive counter</CardDescription>
                        </CardHeader>
                        <CardContent class="text-center">
                            <div class="py-6">
                                <span class="text-6xl font-bold">{counter}</span>
                            </div>
                        </CardContent>
                        <CardFooter class="flex justify-between">
                            <Button variant="outline" on:click={resetCounter}>Reset</Button>
                            <Button on:click={incrementCounter}>Increment</Button>
                        </CardFooter>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Your Information</CardTitle>
                        <CardDescription>This information persists between sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="grid w-full items-center gap-4">
                            <div class="flex flex-col space-y-1.5">
                                <Label for="name">Name</Label>
                                <Input id="name" placeholder="Enter your name" bind:value={name} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p class="text-sm text-muted-foreground">
                            {name ? `Hello, ${name}!` : 'Please enter your name above.'}
                        </p>
                    </CardFooter>
                </Card>
            </TabsContent>
            
            <TabsContent value="features" class="space-y-6 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Mini-App Features</CardTitle>
                        <CardDescription>Key features available to mini-app developers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="border rounded-lg p-4">
                                    <h3 class="font-medium mb-2">Registry Integration</h3>
                                    <p class="text-sm text-muted-foreground">Register your app with the portal and store persistent data.</p>
                                </div>
                                <div class="border rounded-lg p-4">
                                    <h3 class="font-medium mb-2">UI Component Library</h3>
                                    <p class="text-sm text-muted-foreground">Access to all shared UI components for consistent styling.</p>
                                </div>
                                <div class="border rounded-lg p-4">
                                    <h3 class="font-medium mb-2">Theme Support</h3>
                                    <p class="text-sm text-muted-foreground">Light and dark mode support with automatic switching.</p>
                                </div>
                                <div class="border rounded-lg p-4">
                                    <h3 class="font-medium mb-2">Responsive Design</h3>
                                    <p class="text-sm text-muted-foreground">Built-in responsive layouts for all device sizes.</p>
                                </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                                <h3 class="font-medium mb-3">Development Process</h3>
                                <ol class="list-decimal pl-6 space-y-2 text-sm">
                                    <li>Create a new route in the apps directory</li>
                                    <li>Register your app with the miniAppRegistry</li>
                                    <li>Implement app features using shared components</li>
                                    <li>Store and retrieve persistent data</li>
                                    <li>Add your app to the app marketplace</li>
                                </ol>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>API Documentation</CardTitle>
                        <CardDescription>Available APIs for mini-app developers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div class="bg-muted p-4 rounded-md">
                                <h3 class="font-mono text-sm mb-2">miniAppRegistry.registerApp(app)</h3>
                                <p class="text-sm text-muted-foreground">Register your app with the system.</p>
                            </div>
                            <div class="bg-muted p-4 rounded-md">
                                <h3 class="font-mono text-sm mb-2">miniAppRegistry.setActiveApp(appId)</h3>
                                <p class="text-sm text-muted-foreground">Set your app as the active app.</p>
                            </div>
                            <div class="bg-muted p-4 rounded-md">
                                <h3 class="font-mono text-sm mb-2">miniAppRegistry.getAppData(appId)</h3>
                                <p class="text-sm text-muted-foreground">Retrieve persistent app data.</p>
                            </div>
                            <div class="bg-muted p-4 rounded-md">
                                <h3 class="font-mono text-sm mb-2">miniAppRegistry.updateAppData(appId, data)</h3>
                                <p class="text-sm text-muted-foreground">Update persistent app data.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="settings" class="space-y-6 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>App Settings</CardTitle>
                        <CardDescription>Customize your app experience</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <Label>Dark Mode</Label>
                                    <p class="text-sm text-muted-foreground">Toggle dark mode for this app</p>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={(checked) => darkMode = checked}
                                />
                            </div>
                            
                            <Separator />
                            
                            <div class="flex items-center justify-between">
                                <div>
                                    <Label>Save Counter Value</Label>
                                    <p class="text-sm text-muted-foreground">Persist counter between sessions</p>
                                </div>
                                <Switch checked={true} disabled />
                            </div>
                            
                            <Separator />
                            
                            <div class="flex items-center justify-between">
                                <div>
                                    <Label>Reset All Data</Label>
                                    <p class="text-sm text-muted-foreground">Clear all app data and start fresh</p>
                                </div>
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    on:click={() => {
                                        counter = 0;
                                        name = '';
                                        miniAppRegistry.updateAppData(APP_ID, {});
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
</div> 