<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { 
        Database, Search, Filter, Plus, Download, Trash2, Edit, 
        RefreshCw, Eye, MoreHorizontal, Check, X, ChevronDown, 
        ArrowUpDown, ChevronLeft, ChevronRight
    } from 'lucide-svelte';
    
    // Sample data
    const records = [
        { id: 1, name: 'Product Database', type: 'Database', status: 'Active', records: 1245, lastModified: '2023-06-15', owner: 'John Doe' },
        { id: 2, name: 'User Profiles', type: 'Collection', status: 'Active', records: 358, lastModified: '2023-07-21', owner: 'Jane Smith' },
        { id: 3, name: 'Content Repository', type: 'Database', status: 'Inactive', records: 2167, lastModified: '2023-05-03', owner: 'Mike Johnson' },
        { id: 4, name: 'Analytics Data', type: 'Collection', status: 'Active', records: 4532, lastModified: '2023-08-12', owner: 'Sarah Williams' },
        { id: 5, name: 'System Settings', type: 'Configuration', status: 'Active', records: 84, lastModified: '2023-09-01', owner: 'Admin User' },
        { id: 6, name: 'Media Library', type: 'Collection', status: 'Active', records: 723, lastModified: '2023-08-28', owner: 'Design Team' },
        { id: 7, name: 'Customer Orders', type: 'Database', status: 'Active', records: 8765, lastModified: '2023-09-05', owner: 'Sales Department' },
        { id: 8, name: 'Legacy Archive', type: 'Database', status: 'Archived', records: 12543, lastModified: '2022-11-14', owner: 'System' }
    ];
    
    // Database types for filtering
    const databaseTypes = ['All Types', 'Database', 'Collection', 'Configuration'];
    const statusOptions = ['All Statuses', 'Active', 'Inactive', 'Archived'];
    
    // State
    let searchQuery = '';
    let selectedType = 'All Types';
    let selectedStatus = 'All Statuses';
    let selectedRecords: number[] = [];
    let sortField = 'name';
    let sortDirection: 'asc' | 'desc' = 'asc';
    let currentPage = 1;
    let itemsPerPage = 5;
    
    // Computed properties
    $: filteredRecords = records.filter(record => {
        const matchesSearch = searchQuery === '' || 
            record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.owner.toLowerCase().includes(searchQuery.toLowerCase());
            
        const matchesType = selectedType === 'All Types' || record.type === selectedType;
        const matchesStatus = selectedStatus === 'All Statuses' || record.status === selectedStatus;
        
        return matchesSearch && matchesType && matchesStatus;
    });
    
    $: sortedRecords = [...filteredRecords].sort((a, b) => {
        let comparison = 0;
        
        if (sortField === 'name') {
            comparison = a.name.localeCompare(b.name);
        } else if (sortField === 'type') {
            comparison = a.type.localeCompare(b.type);
        } else if (sortField === 'status') {
            comparison = a.status.localeCompare(b.status);
        } else if (sortField === 'records') {
            comparison = a.records - b.records;
        } else if (sortField === 'lastModified') {
            comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
        } else if (sortField === 'owner') {
            comparison = a.owner.localeCompare(b.owner);
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    $: paginatedRecords = sortedRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    $: totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
    
    // Toggle select all records
    function toggleSelectAll() {
        if (selectedRecords.length === paginatedRecords.length) {
            selectedRecords = [];
        } else {
            selectedRecords = paginatedRecords.map(record => record.id);
        }
    }
    
    // Toggle single record selection
    function toggleSelect(id: number) {
        if (selectedRecords.includes(id)) {
            selectedRecords = selectedRecords.filter(recordId => recordId !== id);
        } else {
            selectedRecords = [...selectedRecords, id];
        }
    }
    
    // Sort records by field
    function sortBy(field: string) {
        if (sortField === field) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortField = field;
            sortDirection = 'asc';
        }
    }
    
    // Handle pagination
    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }
    
    // Format date
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }).format(date);
    }
    
    // Reset filters
    function resetFilters() {
        searchQuery = '';
        selectedType = 'All Types';
        selectedStatus = 'All Statuses';
    }
</script>

<div class="data-explorer h-full overflow-auto flex flex-col">
    <div class="p-6">
        <!-- Page header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold mb-2">Data Explorer</h1>
            <p class="text-gray-500 dark:text-gray-400">Browse and manage your databases and collections</p>
        </div>
        
        <!-- Filters and actions section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                <!-- Search -->
                <div class="relative flex-1 max-w-md">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={16} class="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search databases and collections..." 
                        class="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        bind:value={searchQuery}
                    />
                </div>
                
                <!-- Actions -->
                <div class="flex flex-wrap gap-2">
                    <button class="btn btn-primary btn-sm gap-1">
                        <Plus size={14} />
                        <span>New Database</span>
                    </button>
                    <button class="btn btn-outline btn-sm gap-1">
                        <Download size={14} />
                        <span>Export</span>
                    </button>
                    <button class="btn btn-outline btn-sm">
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>
            
            <div class="flex flex-wrap gap-4">
                <!-- Type filter -->
                <div class="flex-1 min-w-[180px]">
                    <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Database Type</label>
                    <div class="relative">
                        <select 
                            class="appearance-none w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            bind:value={selectedType}
                        >
                            {#each databaseTypes as type}
                                <option value={type}>{type}</option>
                            {/each}
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>
                
                <!-- Status filter -->
                <div class="flex-1 min-w-[180px]">
                    <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Status</label>
                    <div class="relative">
                        <select 
                            class="appearance-none w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            bind:value={selectedStatus}
                        >
                            {#each statusOptions as status}
                                <option value={status}>{status}</option>
                            {/each}
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>
                
                <!-- Clear filters -->
                <div class="flex items-end">
                    <button 
                        class="text-primary text-sm hover:underline flex items-center gap-1"
                        on:click={resetFilters}
                    >
                        <X size={14} />
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Table section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Table header with bulk actions -->
            {#if selectedRecords.length > 0}
                <div class="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 border-b border-blue-100 dark:border-blue-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-blue-700 dark:text-blue-300">{selectedRecords.length} items selected</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 p-1 rounded">
                            <Download size={16} />
                        </button>
                        <button class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            {/if}
            
            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left">
                                <div class="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600"
                                        checked={selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0}
                                        on:change={toggleSelectAll}
                                    />
                                </div>
                            </th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" on:click={() => sortBy('name')}>
                                <div class="flex items-center gap-1">
                                    <span>Name</span>
                                    <ArrowUpDown size={14} class={sortField === 'name' ? 'text-primary' : ''} />
                                </div>
                            </th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" on:click={() => sortBy('type')}>
                                <div class="flex items-center gap-1">
                                    <span>Type</span>
                                    <ArrowUpDown size={14} class={sortField === 'type' ? 'text-primary' : ''} />
                                </div>
                            </th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" on:click={() => sortBy('status')}>
                                <div class="flex items-center gap-1">
                                    <span>Status</span>
                                    <ArrowUpDown size={14} class={sortField === 'status' ? 'text-primary' : ''} />
                                </div>
                            </th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" on:click={() => sortBy('records')}>
                                <div class="flex items-center gap-1">
                                    <span>Records</span>
                                    <ArrowUpDown size={14} class={sortField === 'records' ? 'text-primary' : ''} />
                                </div>
                            </th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" on:click={() => sortBy('lastModified')}>
                                <div class="flex items-center gap-1">
                                    <span>Last Modified</span>
                                    <ArrowUpDown size={14} class={sortField === 'lastModified' ? 'text-primary' : ''} />
                                </div>
                            </th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" on:click={() => sortBy('owner')}>
                                <div class="flex items-center gap-1">
                                    <span>Owner</span>
                                    <ArrowUpDown size={14} class={sortField === 'owner' ? 'text-primary' : ''} />
                                </div>
                            </th>
                            <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {#each paginatedRecords as record}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <input 
                                        type="checkbox" 
                                        class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600"
                                        checked={selectedRecords.includes(record.id)}
                                        on:change={() => toggleSelect(record.id)}
                                    />
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="p-2 mr-2 rounded bg-primary/10 text-primary">
                                            <Database size={14} />
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium text-gray-900 dark:text-white">{record.name}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">ID: {record.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <span class="text-sm text-gray-500 dark:text-gray-400">{record.type}</span>
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        record.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                        record.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {record.records.toLocaleString()}
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(record.lastModified)}
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {record.owner}
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" title="View">
                                            <Eye size={16} />
                                        </button>
                                        <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" title="More">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                        
                        {#if paginatedRecords.length === 0}
                            <tr>
                                <td colspan="8" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                    <div class="flex flex-col items-center justify-center">
                                        <Database size={24} class="mb-2 text-gray-400" />
                                        <p>No databases found matching your criteria</p>
                                        <button 
                                            class="mt-2 text-primary text-sm hover:underline"
                                            on:click={resetFilters}
                                        >
                                            Reset filters
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            {#if totalPages > 1}
                <div class="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span class="font-medium">{Math.min(currentPage * itemsPerPage, sortedRecords.length)}</span> of <span class="font-medium">{sortedRecords.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button 
                                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                                    disabled={currentPage === 1}
                                    on:click={() => goToPage(currentPage - 1)}
                                >
                                    <span class="sr-only">Previous</span>
                                    <ChevronLeft size={16} />
                                </button>
                                
                                {#each Array(totalPages) as _, i}
                                    {#if i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)}
                                        <button 
                                            class={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage === i + 1 
                                                    ? 'z-10 bg-primary border-primary text-white' 
                                                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                            }`}
                                            on:click={() => goToPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    {:else if i + 1 === currentPage - 2 || i + 1 === currentPage + 2}
                                        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            ...
                                        </span>
                                    {/if}
                                {/each}
                                
                                <button 
                                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                                    disabled={currentPage === totalPages}
                                    on:click={() => goToPage(currentPage + 1)}
                                >
                                    <span class="sr-only">Next</span>
                                    <ChevronRight size={16} />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div> 