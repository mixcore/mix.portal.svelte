'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { PlayCircle, Save, Download, Clock, Database } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';
import { Badge } from '@/components/ui/badge';

interface QueryResult {
  columns: string[];
  rows: any[];
  executionTime: number;
}

export function QueryEditor() {
  const { activeDbContext } = useDatabase();
  const [sql, setSql] = useState(() => {
    // Set initial SQL based on database context
    if (activeDbContext.id === 'analytics') {
      return 'SELECT * FROM "analytics_events" LIMIT 10;';
    } else if (activeDbContext.id === 'legacy') {
      return 'SELECT * FROM "legacy_customers" LIMIT 10;';
    } else {
      return 'SELECT * FROM "demo_customers" LIMIT 10;';
    }
  });
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<QueryResult | null>(null);
  const [savedQueries, setSavedQueries] = useState<{ id: number; name: string; query: string; dbContextId: string }[]>([
    { id: 1, name: 'Get all customers', query: 'SELECT * FROM "demo_customers";', dbContextId: 'default' },
    { id: 2, name: 'Products in stock', query: 'SELECT * FROM "demo_products" WHERE "inStock" = true;', dbContextId: 'default' },
    { id: 3, name: 'Recent analytics events', query: 'SELECT * FROM "analytics_events" ORDER BY timestamp DESC LIMIT 50;', dbContextId: 'analytics' },
    { id: 4, name: 'Legacy orders summary', query: 'SELECT COUNT(*) as total, status FROM "legacy_orders" GROUP BY status;', dbContextId: 'legacy' }
  ]);

  // When the database context changes, update SQL if there's a saved query for that context
  useEffect(() => {
    const contextQueries = savedQueries.filter(q => q.dbContextId === activeDbContext.id);
    if (contextQueries.length > 0) {
      setSql(contextQueries[0].query);
    } else {
      // Default query for this context
      if (activeDbContext.id === 'analytics') {
        setSql('SELECT * FROM "analytics_events" LIMIT 10;');
      } else if (activeDbContext.id === 'legacy') {
        setSql('SELECT * FROM "legacy_customers" LIMIT 10;');
      } else {
        setSql('SELECT * FROM "demo_customers" LIMIT 10;');
      }
    }
    
    // Clear previous results when changing context
    setResults(null);
  }, [activeDbContext.id]);

  const handleExecuteQuery = async () => {
    setIsExecuting(true);
    
    try {
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate results based on context
      if (activeDbContext.id === 'analytics') {
        setResults({
          columns: ['event_id', 'user_id', 'event_type', 'timestamp', 'data'],
          rows: [
            { event_id: 'evt123', user_id: 'user456', event_type: 'page_view', timestamp: '2023-10-15T12:34:56Z', data: '{"page":"/home"}' },
            { event_id: 'evt124', user_id: 'user789', event_type: 'click', timestamp: '2023-10-15T12:35:22Z', data: '{"element":"button-signup"}' },
            { event_id: 'evt125', user_id: 'user456', event_type: 'form_submit', timestamp: '2023-10-15T12:36:10Z', data: '{"form":"contact"}' },
          ],
          executionTime: 0.032
        });
      } else if (activeDbContext.id === 'legacy') {
        setResults({
          columns: ['customer_id', 'name', 'email', 'region', 'signup_date'],
          rows: [
            { customer_id: 'CUST001', name: 'Old Corp Inc.', email: 'contact@oldcorp.com', region: 'West', signup_date: '2020-03-15' },
            { customer_id: 'CUST002', name: 'Legacy Systems LLC', email: 'info@legacysystems.com', region: 'East', signup_date: '2020-04-22' },
            { customer_id: 'CUST003', name: 'Vintage Tech', email: 'support@vintagetech.com', region: 'North', signup_date: '2020-05-10' },
          ],
          executionTime: 0.078
        });
      } else {
        setResults({
          columns: ['id', 'name', 'email', 'status'],
          rows: [
            { id: 'cust1', name: 'John Doe', email: 'john@example.com', status: 'active' },
            { id: 'cust2', name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
            { id: 'cust3', name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive' },
          ],
          executionTime: 0.045
        });
      }
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveQuery = () => {
    const name = prompt('Enter a name for this query:');
    if (name) {
      setSavedQueries([
        ...savedQueries,
        { 
          id: savedQueries.length + 1, 
          name, 
          query: sql,
          dbContextId: activeDbContext.id
        }
      ]);
    }
  };

  const loadSavedQuery = (query: string) => {
    setSql(query);
  };

  // Filter saved queries to only show ones relevant to the current db context
  const filteredSavedQueries = savedQueries.filter(
    query => query.dbContextId === activeDbContext.id
  );

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
    <div className="query-editor-container space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                SQL Editor
              </CardTitle>
              <CardDescription>Write and execute SQL queries on your database</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Connected to {activeDbContext.name} ({getDbTypeLabel(activeDbContext.type)})
              </span>
              <Badge variant={activeDbContext.status === 'connected' ? 'outline' : 'destructive'} className="text-xs">
                {activeDbContext.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="sql-editor-area mb-4">
            <Textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="Enter SQL query..."
              className="font-mono text-sm h-40"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleExecuteQuery} 
                disabled={isExecuting}
                className="gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                {isExecuting ? 'Executing...' : 'Run'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSaveQuery}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
            
            {results && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Executed in {results.executionTime}s</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="results" className="w-full">
        <TabsList>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="saved">
            Saved Queries
            {filteredSavedQueries.length > 0 && (
              <Badge variant="secondary" className="ml-2">{filteredSavedQueries.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="results">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Query Results</CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="results-table-container">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted border-b">
                          {results.columns.map((column, idx) => (
                            <th key={idx} className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="border-b">
                            {results.columns.map((column, colIdx) => (
                              <td key={colIdx} className="py-2 px-3 text-sm">
                                {row[column]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    {results.rows.length} rows returned
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  Execute a query to see results
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end pt-0">
              <Button variant="outline" disabled={!results} className="gap-2">
                <Download className="h-4 w-4" />
                Export Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">
                Saved Queries for {activeDbContext.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSavedQueries.length > 0 ? (
                <div className="saved-queries grid gap-2">
                  {filteredSavedQueries.map((savedQuery) => (
                    <div 
                      key={savedQuery.id} 
                      className="saved-query border rounded-md p-3 cursor-pointer hover:bg-muted"
                      onClick={() => loadSavedQuery(savedQuery.query)}
                    >
                      <div className="font-medium">{savedQuery.name}</div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
                        {savedQuery.query}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No saved queries for {activeDbContext.name}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 