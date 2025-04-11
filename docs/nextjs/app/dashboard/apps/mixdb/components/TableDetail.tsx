'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDatabase } from '../contexts/DatabaseContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowLeft, ArrowRight, Database, Filter, Search,
  MoreHorizontal, DownloadCloud, Trash2, Edit, RefreshCw,
  BookOpen, Key, Calendar, Clock, AlignLeft, Hash 
} from 'lucide-react';

interface TableColumn {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  defaultValue?: string;
}

interface TableRecord {
  [key: string]: any;
}

interface TableDetailProps {
  tableName: string;
  onBackClick: () => void;
}

export function TableDetail({ tableName, onBackClick }: TableDetailProps) {
  const { activeDbContext } = useDatabase();
  const [table, setTable] = useState<{
    name: string;
    description: string;
    schema: string;
    rowCount: number;
    createdAt: string;
    updatedAt: string;
    columns: TableColumn[];
    sql: string;
  } | null>(null);
  
  const [records, setRecords] = useState<TableRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const recordsPerPage = 10;

  useEffect(() => {
    // Reset state when table or database context changes
    setIsLoading(true);
    setIsLoadingRecords(true);
    setCurrentPage(1);
    setSearchQuery('');
    
    // In a real app, this would fetch data from an API endpoint
    const fetchTableDetails = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate different demo data based on the active database context
        let mockData;
        
        if (activeDbContext.id === 'analytics') {
          if (tableName === 'analytics_events') {
            mockData = {
              name: 'analytics_events',
              description: 'Stores all user events and interactions',
              schema: 'analytics',
              rowCount: 24387,
              createdAt: '2023-08-15T10:30:00Z',
              updatedAt: '2023-10-25T14:12:33Z',
              columns: [
                { name: 'event_id', type: 'uuid', isNullable: false, isPrimaryKey: true },
                { name: 'user_id', type: 'varchar', isNullable: false, isPrimaryKey: false },
                { name: 'event_type', type: 'varchar', isNullable: false, isPrimaryKey: false },
                { name: 'timestamp', type: 'timestamp', isNullable: false, isPrimaryKey: false },
                { name: 'data', type: 'jsonb', isNullable: true, isPrimaryKey: false },
              ],
              sql: 'CREATE TABLE "analytics"."analytics_events" (\n  "event_id" uuid NOT NULL,\n  "user_id" varchar NOT NULL,\n  "event_type" varchar NOT NULL,\n  "timestamp" timestamp NOT NULL,\n  "data" jsonb,\n  CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("event_id")\n);'
            };
          } else {
            mockData = {
              name: tableName,
              description: 'Analytics related table',
              schema: 'analytics',
              rowCount: 5280,
              createdAt: '2023-08-15T10:30:00Z',
              updatedAt: '2023-10-25T14:12:33Z',
              columns: [
                { name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
                { name: 'name', type: 'varchar', isNullable: false, isPrimaryKey: false },
                { name: 'created_at', type: 'timestamp', isNullable: false, isPrimaryKey: false },
              ],
              sql: `CREATE TABLE "analytics"."${tableName}" (\n  "id" uuid NOT NULL,\n  "name" varchar NOT NULL,\n  "created_at" timestamp NOT NULL,\n  CONSTRAINT "${tableName}_pkey" PRIMARY KEY ("id")\n);`
            };
          }
        } else if (activeDbContext.id === 'legacy') {
          if (tableName === 'legacy_customers') {
            mockData = {
              name: 'legacy_customers',
              description: 'Customer data from the old system',
              schema: 'legacy',
              rowCount: 1289,
              createdAt: '2020-03-10T09:15:00Z',
              updatedAt: '2022-11-05T11:42:18Z',
              columns: [
                { name: 'customer_id', type: 'varchar', isNullable: false, isPrimaryKey: true },
                { name: 'name', type: 'varchar', isNullable: false, isPrimaryKey: false },
                { name: 'email', type: 'varchar', isNullable: true, isPrimaryKey: false },
                { name: 'region', type: 'varchar', isNullable: true, isPrimaryKey: false },
                { name: 'signup_date', type: 'date', isNullable: false, isPrimaryKey: false },
              ],
              sql: 'CREATE TABLE "legacy"."legacy_customers" (\n  "customer_id" varchar NOT NULL,\n  "name" varchar NOT NULL,\n  "email" varchar,\n  "region" varchar,\n  "signup_date" date NOT NULL,\n  CONSTRAINT "legacy_customers_pkey" PRIMARY KEY ("customer_id")\n);'
            };
          } else {
            mockData = {
              name: tableName,
              description: 'Legacy system table',
              schema: 'legacy',
              rowCount: 3421,
              createdAt: '2020-03-10T09:15:00Z',
              updatedAt: '2022-11-05T11:42:18Z',
              columns: [
                { name: 'id', type: 'varchar', isNullable: false, isPrimaryKey: true },
                { name: 'description', type: 'text', isNullable: true, isPrimaryKey: false },
                { name: 'created_date', type: 'date', isNullable: false, isPrimaryKey: false },
              ],
              sql: `CREATE TABLE "legacy"."${tableName}" (\n  "id" varchar NOT NULL,\n  "description" text,\n  "created_date" date NOT NULL,\n  CONSTRAINT "${tableName}_pkey" PRIMARY KEY ("id")\n);`
            };
          }
        } else {
          // Default database context
          if (tableName === 'demo_customers') {
            mockData = {
              name: 'demo_customers',
              description: 'Main customers table',
              schema: 'public',
              rowCount: 1250,
              createdAt: '2023-10-01T08:00:00Z',
              updatedAt: '2023-10-25T14:12:33Z',
              columns: [
                { name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
                { name: 'name', type: 'varchar', isNullable: false, isPrimaryKey: false },
                { name: 'email', type: 'varchar', isNullable: false, isPrimaryKey: false },
                { name: 'status', type: 'varchar', isNullable: false, isPrimaryKey: false, defaultValue: 'active' },
                { name: 'created_at', type: 'timestamp', isNullable: false, isPrimaryKey: false },
              ],
              sql: 'CREATE TABLE "public"."demo_customers" (\n  "id" uuid NOT NULL,\n  "name" varchar NOT NULL,\n  "email" varchar NOT NULL,\n  "status" varchar NOT NULL DEFAULT \'active\',\n  "created_at" timestamp NOT NULL,\n  CONSTRAINT "demo_customers_pkey" PRIMARY KEY ("id")\n);'
            };
          } else {
            mockData = {
              name: tableName,
              description: 'Application table',
              schema: 'public',
              rowCount: 523,
              createdAt: '2023-10-01T08:00:00Z',
              updatedAt: '2023-10-20T11:42:33Z',
              columns: [
                { name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
                { name: 'name', type: 'varchar', isNullable: false, isPrimaryKey: false },
                { name: 'created_at', type: 'timestamp', isNullable: false, isPrimaryKey: false },
              ],
              sql: `CREATE TABLE "public"."${tableName}" (\n  "id" uuid NOT NULL,\n  "name" varchar NOT NULL,\n  "created_at" timestamp NOT NULL,\n  CONSTRAINT "${tableName}_pkey" PRIMARY KEY ("id")\n);`
            };
          }
        }

        setTable(mockData);
      } catch (error) {
        console.error('Error fetching table details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableDetails();
  }, [tableName, activeDbContext.id]);

  useEffect(() => {
    // In a real app, this would fetch data from an API endpoint with pagination
    const fetchRecords = async () => {
      try {
        setIsLoadingRecords(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        let mockRecords: TableRecord[] = [];
        
        // Generate different mock records based on active database context and table
        if (activeDbContext.id === 'analytics') {
          if (tableName === 'analytics_events') {
            mockRecords = [
              { event_id: 'evt123', user_id: 'user456', event_type: 'page_view', timestamp: '2023-10-15T12:34:56Z', data: '{"page":"/home"}' },
              { event_id: 'evt124', user_id: 'user789', event_type: 'click', timestamp: '2023-10-15T12:35:22Z', data: '{"element":"button-signup"}' },
              { event_id: 'evt125', user_id: 'user456', event_type: 'form_submit', timestamp: '2023-10-15T12:36:10Z', data: '{"form":"contact"}' },
              { event_id: 'evt126', user_id: 'user123', event_type: 'page_view', timestamp: '2023-10-15T12:38:42Z', data: '{"page":"/pricing"}' },
              { event_id: 'evt127', user_id: 'user456', event_type: 'click', timestamp: '2023-10-15T12:39:15Z', data: '{"element":"pricing-basic"}' },
            ];
          } else {
            mockRecords = Array(5).fill(0).map((_, i) => ({
              id: `id-${i + 1}`,
              name: `Analytics Item ${i + 1}`,
              created_at: new Date(Date.now() - i * 86400000).toISOString()
            }));
          }
        } else if (activeDbContext.id === 'legacy') {
          if (tableName === 'legacy_customers') {
            mockRecords = [
              { customer_id: 'CUST001', name: 'Old Corp Inc.', email: 'contact@oldcorp.com', region: 'West', signup_date: '2020-03-15' },
              { customer_id: 'CUST002', name: 'Legacy Systems LLC', email: 'info@legacysystems.com', region: 'East', signup_date: '2020-04-22' },
              { customer_id: 'CUST003', name: 'Vintage Tech', email: 'support@vintagetech.com', region: 'North', signup_date: '2020-05-10' },
              { customer_id: 'CUST004', name: 'Retro Solutions', email: 'hello@retrosolutions.com', region: 'South', signup_date: '2020-06-18' },
              { customer_id: 'CUST005', name: 'Classic Data Inc.', email: 'info@classicdata.com', region: 'West', signup_date: '2020-07-05' },
            ];
          } else {
            mockRecords = Array(5).fill(0).map((_, i) => ({
              id: `LEGACY${i + 100}`,
              description: `Legacy record description ${i + 1}`,
              created_date: '2020-0' + (i + 1) + '-15'
            }));
          }
        } else {
          // Default database context
          if (tableName === 'demo_customers') {
            mockRecords = [
              { id: 'uuid-1', name: 'John Doe', email: 'john@example.com', status: 'active', created_at: '2023-10-01T08:30:00Z' },
              { id: 'uuid-2', name: 'Jane Smith', email: 'jane@example.com', status: 'active', created_at: '2023-10-02T09:15:00Z' },
              { id: 'uuid-3', name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', created_at: '2023-10-03T10:45:00Z' },
              { id: 'uuid-4', name: 'Alice Williams', email: 'alice@example.com', status: 'active', created_at: '2023-10-04T11:20:00Z' },
              { id: 'uuid-5', name: 'Chris Miller', email: 'chris@example.com', status: 'pending', created_at: '2023-10-05T12:10:00Z' },
            ];
          } else {
            mockRecords = Array(5).fill(0).map((_, i) => ({
              id: `uuid-${i + 1}`,
              name: `Item ${i + 1}`,
              created_at: new Date(Date.now() - i * 86400000).toISOString()
            }));
          }
        }

        setRecords(mockRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setIsLoadingRecords(false);
      }
    };

    if (!isLoading && table) {
      fetchRecords();
    }
  }, [tableName, currentPage, isLoading, table, activeDbContext.id]);

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

  const getTypeIcon = (type: string) => {
    if (type.includes('int') || type.includes('numeric') || type.includes('decimal')) {
      return <Hash className="h-4 w-4" />;
    } else if (type.includes('varchar') || type.includes('text') || type.includes('char')) {
      return <AlignLeft className="h-4 w-4" />;
    } else if (type.includes('date')) {
      return <Calendar className="h-4 w-4" />;
    } else if (type.includes('time')) {
      return <Clock className="h-4 w-4" />;
    } else {
      return <BookOpen className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading table details...</p>
        </div>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-lg">Table not found</p>
        <Button onClick={onBackClick} variant="secondary" size="sm" className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to tables
        </Button>
      </div>
    );
  }

  return (
    <div className="table-detail-container space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button onClick={onBackClick} variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div className="text-lg font-semibold">{table.name}</div>
          <Badge variant="outline" className="ml-2 text-xs">
            {table.schema}
          </Badge>
          <div className="ml-4 text-sm text-muted-foreground flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span>{activeDbContext.name} ({getDbTypeLabel(activeDbContext.type)})</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <DownloadCloud className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="destructive" size="sm" className="gap-1">
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{table.name}</CardTitle>
              <CardDescription>{table.description}</CardDescription>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Total rows: {table.rowCount.toLocaleString()}</div>
              <div className="text-muted-foreground">Created: {new Date(table.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="sql">SQL Definition</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card>
            <CardHeader className="py-3 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Table Records</CardTitle>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      className="pl-8 h-9 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {isLoadingRecords ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : records.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(records[0]).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record, i) => (
                        <TableRow key={i}>
                          {Object.values(record).map((value, j) => (
                            <TableCell key={j}>
                              {typeof value === 'string' && value.startsWith('{') 
                                ? <Badge variant="outline">JSON</Badge>
                                : String(value)
                              }
                            </TableCell>
                          ))}
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No records found
                </div>
              )}
            </CardContent>
            
            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {records.length} of {table.rowCount} records
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-sm">
                  Page {currentPage} of {Math.ceil(table.rowCount / recordsPerPage)}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(table.rowCount / recordsPerPage), prev + 1))}
                  disabled={currentPage >= Math.ceil(table.rowCount / recordsPerPage)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="structure">
          <Card>
            <CardHeader className="py-3 border-b">
              <CardTitle className="text-base">Table Structure</CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Nullable</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.columns.map((column, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {column.isPrimaryKey && <Key className="h-4 w-4 text-amber-500" title="Primary Key" />}
                      </TableCell>
                      <TableCell className="font-medium">{column.name}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {getTypeIcon(column.type)}
                        <span>{column.type}</span>
                      </TableCell>
                      <TableCell>
                        {column.isNullable ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell>
                        {column.defaultValue || '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sql">
          <Card>
            <CardHeader className="py-3 border-b">
              <CardTitle className="text-base">SQL Definition</CardTitle>
            </CardHeader>
            
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
                {table.sql}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}