'use client';

import React from 'react';
import { fetchClient } from '@/services/fetchClient';

/**
 * Utility function to run a comprehensive diagnostic test on API connectivity
 * Useful for debugging "Failed to fetch" and other network-related errors
 */
export async function runApiDiagnostics(
  endpoint?: string
): Promise<{ summary: string; details: any }> {
  console.log('📊 Running API diagnostics...');

  try {
    // First check if we can reach the internet at all
    const connectionTest = await fetchClient.diagnoseConnection();
    console.log('🔍 Connection diagnostics:', connectionTest);

    // If we can reach the internet, check specific endpoint
    if (endpoint) {
      const endpointTest = await fetchClient.testConnection(endpoint);
      console.log(`🔌 Endpoint test (${endpoint}):`, endpointTest);

      return {
        summary:
          connectionTest.summary +
          (endpointTest.success
            ? ` Specific endpoint "${endpoint}" is working.`
            : ` However, endpoint "${endpoint}" failed: ${endpointTest.message}`),
        details: {
          connection: connectionTest,
          endpoint: endpointTest
        }
      };
    }

    return {
      summary: connectionTest.summary,
      details: connectionTest
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Diagnostics failed:', errorMessage);

    return {
      summary: `Diagnostics failed: ${errorMessage}`,
      details: { error: errorMessage }
    };
  }
}

/**
 * Creates a button component that runs API diagnostics when clicked
 * and displays the results in the console
 */
export function ApiDiagnosticsButton({
  endpoint,
  label = 'Test API Connection'
}: {
  endpoint?: string;
  label?: string;
}) {
  const runTest = async () => {
    const results = await runApiDiagnostics(endpoint);

    console.log('📝 API Diagnostics Results:', results);

    // Show user-friendly alert
    alert(`API Diagnostics: ${results.summary}`);
  };

  return (
    <button
      onClick={runTest}
      style={{
        padding: '8px 16px',
        background: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      {label}
    </button>
  );
}
