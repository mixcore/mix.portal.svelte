'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, UploadCloud, Download, Search, Database, Settings, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDatabase } from '../contexts/DatabaseContext';

interface TableItem {
  id: string;
  name: string;
  displayName: string;
  description: string;
  createdDate: string;
  isSystem: boolean;
  rowCount: number;
}

interface TableListProps {
  onTableClick: (tableId: string) => void;
}

export function TableList({ onTableClick }: TableListProps) {
  const { activeDbContext } = useDatabase();
  const [tables, setTables] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real implementation, this would fetch data from an API for the specific context
    const fetchTables = async () => {
      setIsLoading(true);
      try {
        // Simulate API call with demo data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Different tables for different contexts
        if (activeDbContext.id === 'analytics') {
          setTables([
            {
              id: 'analytics_events',
              name: 'analytics_events',
              displayName: 'Events',
              description: 'User event tracking data',
              createdDate: '2023-07-15T00:00:00Z',
              isSystem: false,
              rowCount: 15782
            },
            {
              id: 'analytics_users',
              name: 'analytics_users',
              displayName: 'Users',
              description: 'User profile data for analytics',
              createdDate: '2023-07-15T00:00:00Z',
              isSystem: false,
              rowCount: 5423
            },
            {
              id: 'analytics_sessions',
              name: 'analytics_sessions',
              displayName: 'Sessions',
              description: 'User session data',
              createdDate: '2023-07-16T00:00:00Z',
              isSystem: false,
              rowCount: 28941
            }
          ]);
        } else if (activeDbContext.id === 'legacy') {
          setTables([
            {
              id: 'legacy_customers',
              name: 'legacy_customers',
              displayName: 'Legacy Customers',
              description: 'Customer data from legacy system',
              createdDate: '2022-01-05T00:00:00Z',
              isSystem: false,
              rowCount: 1205
            },
            {
              id: 'legacy_orders',
              name: 'legacy_orders',
              displayName: 'Legacy Orders',
              description: 'Order data from legacy system',
              createdDate: '2022-01-05T00:00:00Z',
              isSystem: false,
              rowCount: 8456
            }
          ]);
        } else {
          // Default database
          setTables([
            {
              id: 'demo_customers',
              name: 'demo_customers',
              displayName: 'Customers',
              description: 'Sample customer data for demonstration',
              createdDate: '2023-08-01T00:00:00Z',
              isSystem: false,
              rowCount: 25
            },
            {
              id: 'demo_products',
              name: 'demo_products',
              displayName: 'Products',
              description: 'Sample product data for demonstration',
              createdDate: '2023-08-01T00:00:00Z',
              isSystem: false,
              rowCount: 18
            },
            {
              id: 'mixdb_tables',
              name: 'mixdb_tables',
              displayName: 'Database Tables',
              description: 'Stores the database tables created in MixDB',
              createdDate: '2023-07-01T00:00:00Z',
              isSystem: true,
              rowCount: 3
            },
            {
              id: 'mixdb_fields',
              name: 'mixdb_fields',
              displayName: 'Table Fields',
              description: 'Stores the fields for each database table',
              createdDate: '2023-07-01T00:00:00Z',
              isSystem: true,
              rowCount: 24
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, [activeDbContext.id]);

  const filteredTables = tables.filter(table => 
    table.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRecords = tables.reduce((sum, table) => sum + table.rowCount, 0);
  const systemTables = tables.filter(t => t.isSystem).length;
  const customTables = tables.filter(t => !t.isSystem).length;

  const getDbTypeLabel = (type: string) => {
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
    <div className="table-list-container space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {activeDbContext.name}
          </CardTitle>
          <CardDescription>
            {getDbTypeLabel(activeDbContext.type)} database
            {activeDbContext.isDefault && " (default)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Tables</div>
              <div className="text-2xl font-bold">{tables.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Records</div>
              <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-base font-medium mt-1 flex items-center">
                <Badge variant={activeDbContext.status === 'connected' ? 'outline' : 'destructive'} className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${activeDbContext.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {activeDbContext.status === 'connected' ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Tables
            </CardTitle>
            <CardDescription>Database tables overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tables.length}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {systemTables} system, {customTables} custom
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M3 3v18h18"></path>
                <path d="M18.4 9a9 9 0 0 1-9.5 9.4"></path>
                <path d="M8 10a14.3 14.3 0 0 1 5 8.5"></path>
                <path d="M12 4a14.3 14.3 0 0 0 5 8.5"></path>
                <path d="M21 3a9 9 0 0 1-9.5 9.4"></path>
              </svg>
              Records
            </CardTitle>
            <CardDescription>Total database records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Across all tables
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Storage
            </CardTitle>
            <CardDescription>Database storage usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128 KB</div>
            <div className="text-sm text-muted-foreground mt-1">
              0.1% of quota
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tables..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <UploadCloud className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            New Table
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="py-3 pb-0">
          <CardTitle>Database Tables</CardTitle>
          {activeDbContext.id !== 'default' && (
            <CardDescription>
              Tables in {activeDbContext.name} ({getDbTypeLabel(activeDbContext.type)})
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Loading tables...</p>
            </div>
          ) : (
            <>
              {filteredTables.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">No tables match your search</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Rows</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTables.map((table) => (
                        <TableRow 
                          key={table.id}
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => onTableClick(table.id)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Database className="h-4 w-4 mr-2 text-primary" />
                              {table.displayName}
                            </div>
                          </TableCell>
                          <TableCell>{table.description}</TableCell>
                          <TableCell>{table.rowCount.toLocaleString()}</TableCell>
                          <TableCell>{new Date(table.createdDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {table.isSystem ? (
                              <Badge variant="secondary">System</Badge>
                            ) : (
                              <Badge variant="outline">Custom</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="py-3 text-xs text-muted-foreground border-t">
          <div className="flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            <span>Connected to {activeDbContext.name} ({getDbTypeLabel(activeDbContext.type)})</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 