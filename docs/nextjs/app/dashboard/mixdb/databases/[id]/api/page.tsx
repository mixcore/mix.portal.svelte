'use client';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // This is a placeholder - in production you'd want to specify actual IDs
  return [
    { api: 'demo-1' },
    { api: 'demo-2' }
  ];
}


import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/copy-button';
import { Icons } from '@/components/icons';
import { MixDbService } from '@/lib/services/mixdb-service';
import { MixDatabase, MixDatabaseColumn } from '@/types/mixdb';
import { LoadingSection } from '@/components/loading-section';

const HTTP_METHODS = [
  {
    name: 'GET',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  {
    name: 'POST',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  {
    name: 'PUT',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
  },
  {
    name: 'PATCH',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  },
  {
    name: 'DELETE',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
];

const LANGUAGES = [
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'Python', value: 'python' },
  { name: 'C#', value: 'csharp' },
  { name: 'Curl', value: 'bash' }
];

const CodeSnippet = ({
  language,
  databaseName,
  apiEndpoint
}: {
  language: string;
  databaseName: string;
  apiEndpoint: string;
}) => {
  let code = '';

  switch (language) {
    case 'javascript':
      code = `// Fetch all records from ${databaseName}
const response = await fetch("${apiEndpoint}/api/mixdb/${databaseName}", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
});

const data = await response.json();
console.log(data);`;
      break;
    case 'typescript':
      code = `// Fetch all records from ${databaseName} with TypeScript
interface DatabaseRecord {
  id: number;
  // Add other fields based on your schema
}

async function fetchData(): Promise<DatabaseRecord[]> {
  const response = await fetch("${apiEndpoint}/api/mixdb/${databaseName}", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    },
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  return data.items as DatabaseRecord[];
}`;
      break;
    case 'python':
      code = `# Fetch all records from ${databaseName} with Python
import requests

url = "${apiEndpoint}/api/mixdb/${databaseName}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`;
      break;
    case 'csharp':
      code = `// Fetch all records from ${databaseName} with C#
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

class MixDbClient
{
    static async Task Main()
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");
            
            var response = await client.GetAsync("${apiEndpoint}/api/mixdb/${databaseName}");
            
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                Console.WriteLine(data);
            }
        }
    }
}`;
      break;
    case 'bash':
      code = `# Fetch all records from ${databaseName} with curl
curl -X GET "${apiEndpoint}/api/mixdb/${databaseName}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;
      break;
    default:
      code = '// Select a language to see code example';
  }

  return (
    <div className='relative'>
      <pre className='bg-muted max-h-[400px] overflow-auto rounded-md p-4 font-mono text-sm'>
        <code>{code}</code>
      </pre>
      <div className='absolute top-2 right-2'>
        <CopyButton text={code} />
      </div>
    </div>
  );
};

export default function DatabaseApiPage() {
  const params = useParams();
  const router = useRouter();
  const databaseId = Number(params.id);

  const [database, setDatabase] = useState<MixDatabase | null>(null);
  const [columns, setColumns] = useState<MixDatabaseColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<string>('javascript');
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(
    'https://api.example.com'
  );
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    if (databaseId) {
      fetchDatabase();
    }
  }, [databaseId]);

  const fetchDatabase = async () => {
    try {
      setLoading(true);
      const data = await MixDbService.getDatabase(databaseId);
      setDatabase(data);
      setColumns(data.columns || []);
    } catch (error) {
      console.error('Error fetching database schema:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSection />;
  }

  if (!database) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <Icons.database className='text-muted-foreground/50 h-12 w-12' />
        <h3 className='mt-4 text-lg font-medium'>Database Not Found</h3>
        <p className='text-muted-foreground mt-2 text-sm'>
          The database you're looking for doesn't exist or you don't have
          permission to access it.
        </p>
        <Button
          className='mt-4'
          onClick={() => router.push('/dashboard/mixdb/databases')}
        >
          <Icons.arrowLeft className='mr-2 h-4 w-4' />
          Go Back to Databases
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex flex-col justify-between gap-4 md:flex-row'>
        <div>
          <h2 className='mb-2 text-xl font-semibold tracking-tight'>
            API Reference
          </h2>
          <p className='text-muted-foreground'>
            Use the MixDB REST API to interact with your database
            programmatically.
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select language' />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant='outline' size='sm'>
            <Icons.book className='mr-2 h-4 w-4' />
            View Full Documentation
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Generate an API key to authenticate your requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>API Key</label>
                <div className='flex gap-2'>
                  <Input
                    value={apiKey || 'No API key generated'}
                    readOnly
                    className='font-mono text-xs'
                  />
                  <Button size='sm' variant='secondary'>
                    {apiKey ? 'Regenerate' : 'Generate'} Key
                  </Button>
                </div>
                <p className='text-muted-foreground text-xs'>
                  Your API key provides full access to your database. Keep it
                  secret!
                </p>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>API Base URL</label>
                <div className='flex gap-2'>
                  <Input
                    value={apiBaseUrl}
                    onChange={(e) => setApiBaseUrl(e.target.value)}
                    className='font-mono text-xs'
                  />
                </div>
                <p className='text-muted-foreground text-xs'>
                  This is your API's base URL. All endpoints will be relative to
                  this URL.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Quick example to fetch data from {database.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeSnippet
              language={language}
              databaseName={database.name}
              apiEndpoint={apiBaseUrl}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='endpoints'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='endpoints'>Endpoints</TabsTrigger>
          <TabsTrigger value='models'>Data Models</TabsTrigger>
        </TabsList>

        <TabsContent value='endpoints' className='space-y-6'>
          {HTTP_METHODS.map((method, index) => (
            <Card key={index}>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>
                    {method.name === 'GET'
                      ? 'Fetch Records'
                      : method.name === 'POST'
                        ? 'Create Record'
                        : method.name === 'PUT' || method.name === 'PATCH'
                          ? 'Update Record'
                          : 'Delete Record'}
                  </CardTitle>
                  <Badge className={`${method.color} px-2 py-1 font-mono`}>
                    {method.name}
                  </Badge>
                </div>
                <CardDescription className='font-mono text-xs'>
                  {apiBaseUrl}/api/mixdb/{database.name}
                  {method.name !== 'POST' ? '/{id}' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div>
                    <h4 className='mb-1 text-sm font-medium'>Description</h4>
                    <p className='text-muted-foreground text-sm'>
                      {method.name === 'GET'
                        ? 'Retrieve all records or a specific record by ID from the database.'
                        : method.name === 'POST'
                          ? 'Create a new record in the database.'
                          : method.name === 'PUT' || method.name === 'PATCH'
                            ? 'Update an existing record in the database.'
                            : 'Delete a record from the database.'}
                    </p>
                  </div>

                  {method.name !== 'GET' && method.name !== 'DELETE' && (
                    <div>
                      <h4 className='mb-1 text-sm font-medium'>Request Body</h4>
                      <div className='relative'>
                        <pre className='bg-muted max-h-[200px] overflow-auto rounded-md p-3 font-mono text-xs'>
                          <code>{`{
  ${columns.map((col) => `"${col.name}": ${col.dataType === 'Text' ? '"example"' : col.dataType === 'Integer' ? '123' : col.dataType === 'Boolean' ? 'true' : col.dataType === 'Double' ? '123.45' : col.dataType === 'DateTime' ? '"2023-05-01T12:00:00Z"' : '"value"'}`).join(',\n  ')}
}`}</code>
                        </pre>
                        <div className='absolute top-2 right-2'>
                          <CopyButton
                            text={`{
  ${columns.map((col) => `"${col.name}": ${col.dataType === 'Text' ? '"example"' : col.dataType === 'Integer' ? '123' : col.dataType === 'Boolean' ? 'true' : col.dataType === 'Double' ? '123.45' : col.dataType === 'DateTime' ? '"2023-05-01T12:00:00Z"' : '"value"'}`).join(',\n  ')}
}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className='mb-1 text-sm font-medium'>Example</h4>
                    <CodeSnippet
                      language={language}
                      databaseName={database.name}
                      apiEndpoint={apiBaseUrl}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value='models' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>
                Model definition for {database.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='relative'>
                <pre className='bg-muted max-h-[400px] overflow-auto rounded-md p-4 font-mono text-sm'>
                  <code>{`interface ${database.name.charAt(0).toUpperCase() + database.name.slice(1)} {
  id: number;
  createdDateTime: string;
  modifiedDateTime?: string;
  status: string;
  specificulture: string;
${columns.map((col) => `  ${col.name}: ${col.dataType === 'Integer' ? 'number' : col.dataType === 'Double' ? 'number' : col.dataType === 'Boolean' ? 'boolean' : col.dataType === 'Json' ? 'object' : 'string'};`).join('\n')}
}`}</code>
                </pre>
                <div className='absolute top-2 right-2'>
                  <CopyButton
                    text={`interface ${database.name.charAt(0).toUpperCase() + database.name.slice(1)} {
  id: number;
  createdDateTime: string;
  modifiedDateTime?: string;
  status: string;
  specificulture: string;
${columns.map((col) => `  ${col.name}: ${col.dataType === 'Integer' ? 'number' : col.dataType === 'Double' ? 'number' : col.dataType === 'Boolean' ? 'boolean' : col.dataType === 'Json' ? 'object' : 'string'};`).join('\n')}
}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Format</CardTitle>
              <CardDescription>
                Standard response format for all API calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='relative'>
                <pre className='bg-muted max-h-[400px] overflow-auto rounded-md p-4 font-mono text-sm'>
                  <code>{`interface ApiResponse<T> {
  isSucceed: boolean;
  errors: string[];
  responseKey?: string;
  data?: T;
  
  // For list endpoints
  items?: T[];
  pagingData?: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPage: number;
  };
}`}</code>
                </pre>
                <div className='absolute top-2 right-2'>
                  <CopyButton
                    text={`interface ApiResponse<T> {
  isSucceed: boolean;
  errors: string[];
  responseKey?: string;
  data?: T;
  
  // For list endpoints
  items?: T[];
  pagingData?: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPage: number;
  };
}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>
            Additional documentation and resources
          </CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='bg-card rounded-md border p-4'>
            <div className='mb-2 flex items-center gap-3'>
              <Icons.book className='text-primary h-5 w-5' />
              <h3 className='font-semibold'>Documentation</h3>
            </div>
            <p className='text-muted-foreground mb-3 text-sm'>
              Comprehensive guides and API reference for MixDB.
            </p>
            <Button variant='outline' size='sm'>
              View Documentation
            </Button>
          </div>

          <div className='bg-card rounded-md border p-4'>
            <div className='mb-2 flex items-center gap-3'>
              <Icons.code className='text-primary h-5 w-5' />
              <h3 className='font-semibold'>API Client Libraries</h3>
            </div>
            <p className='text-muted-foreground mb-3 text-sm'>
              Official client libraries for various programming languages.
            </p>
            <Button variant='outline' size='sm'>
              View Libraries
            </Button>
          </div>

          <div className='bg-card rounded-md border p-4'>
            <div className='mb-2 flex items-center gap-3'>
              <Icons.file className='text-primary h-5 w-5' />
              <h3 className='font-semibold'>Postman Collection</h3>
            </div>
            <p className='text-muted-foreground mb-3 text-sm'>
              Download a ready-to-use Postman collection for this API.
            </p>
            <Button variant='outline' size='sm'>
              Download Collection
            </Button>
          </div>

          <div className='bg-card rounded-md border p-4'>
            <div className='mb-2 flex items-center gap-3'>
              <Icons.help className='text-primary h-5 w-5' />
              <h3 className='font-semibold'>Support</h3>
            </div>
            <p className='text-muted-foreground mb-3 text-sm'>
              Need help? Reach out to our support team.
            </p>
            <Button variant='outline' size='sm'>
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
