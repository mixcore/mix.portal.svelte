'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Database, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface DbContext {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'mssql' | 'sqlite' | 'oracle' | 'mongodb';
  isDefault?: boolean;
  status: 'connected' | 'disconnected' | 'error';
}

interface DbContextSelectorProps {
  onContextChange: (contextId: string) => void;
}

export function DbContextSelector({ onContextChange }: DbContextSelectorProps) {
  const [contexts, setContexts] = useState<DbContext[]>([
    { 
      id: 'default', 
      name: 'Default Database', 
      type: 'postgres', 
      isDefault: true, 
      status: 'connected' 
    },
    { 
      id: 'analytics', 
      name: 'Analytics DB', 
      type: 'postgres', 
      status: 'connected' 
    },
    { 
      id: 'legacy', 
      name: 'Legacy System', 
      type: 'mysql', 
      status: 'connected' 
    },
    { 
      id: 'reporting', 
      name: 'Reporting DB', 
      type: 'mssql', 
      status: 'disconnected' 
    }
  ]);
  
  const [activeContextId, setActiveContextId] = useState<string>('default');
  const [isNewConnectionOpen, setIsNewConnectionOpen] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'postgres' as DbContext['type'],
    connectionString: '',
    username: '',
    password: ''
  });

  const activeContext = contexts.find(ctx => ctx.id === activeContextId) || contexts[0];

  const handleContextChange = (contextId: string) => {
    setActiveContextId(contextId);
    onContextChange(contextId);
  };

  const handleAddConnection = () => {
    // In a real implementation, this would validate and create the actual connection
    const newDbContext: DbContext = {
      id: `db-${Date.now()}`,
      name: newConnection.name,
      type: newConnection.type,
      status: 'connected'
    };
    
    setContexts([...contexts, newDbContext]);
    setActiveContextId(newDbContext.id);
    onContextChange(newDbContext.id);
    setIsNewConnectionOpen(false);
    
    // Reset form
    setNewConnection({
      name: '',
      type: 'postgres',
      connectionString: '',
      username: '',
      password: ''
    });
  };

  const getDbTypeName = (type: DbContext['type']) => {
    switch (type) {
      case 'postgres': return 'PostgreSQL';
      case 'mysql': return 'MySQL';
      case 'mssql': return 'SQL Server';
      case 'sqlite': return 'SQLite';
      case 'oracle': return 'Oracle';
      case 'mongodb': return 'MongoDB';
      default: return type;
    }
  };

  return (
    <div className="db-context-selector">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Database className="h-4 w-4" />
            <span>{activeContext.name}</span>
            {activeContext.isDefault && (
              <Badge variant="secondary" className="ml-1 text-xs px-1">Default</Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[240px]">
          <DropdownMenuLabel>Database Contexts</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {contexts.map(context => (
            <DropdownMenuItem 
              key={context.id}
              onClick={() => handleContextChange(context.id)}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>{context.name}</span>
              </div>
              {context.id === activeContextId && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={isNewConnectionOpen} onOpenChange={setIsNewConnectionOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>Add Connection</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Database Connection</DialogTitle>
                <DialogDescription>
                  Create a new database connection to manage multiple data sources.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection({...newConnection, name: e.target.value})}
                    className="col-span-3"
                    placeholder="Production Database"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <select 
                    id="type"
                    value={newConnection.type}
                    onChange={(e) => setNewConnection({...newConnection, type: e.target.value as DbContext['type']})}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="postgres">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="mssql">SQL Server</option>
                    <option value="sqlite">SQLite</option>
                    <option value="oracle">Oracle</option>
                    <option value="mongodb">MongoDB</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="connection" className="text-right">
                    Connection
                  </Label>
                  <Input
                    id="connection"
                    value={newConnection.connectionString}
                    onChange={(e) => setNewConnection({...newConnection, connectionString: e.target.value})}
                    className="col-span-3"
                    placeholder="postgresql://user:password@localhost:5432/db"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={newConnection.username}
                    onChange={(e) => setNewConnection({...newConnection, username: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newConnection.password}
                    onChange={(e) => setNewConnection({...newConnection, password: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewConnectionOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleAddConnection}
                  disabled={!newConnection.name || !newConnection.connectionString}
                >
                  Connect
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 