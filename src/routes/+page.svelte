<script lang="ts">
  import { onMount } from 'svelte';
  import RepositorySelector from '$lib/components/RepositorySelector.svelte';
  import CommitChart from '$lib/components/CommitChart.svelte';
  import { fetchRepositories, fetchCommits, addRepository } from '$lib/api/repositories';
  import type { Repository, Commit } from '$lib/api/repositories';

  let repositories: Repository[] = [];
  let commits: Commit[] = [];
  let selectedRepositoryId: string | null = null;
  let loading = false;
  let error: string | null = null;

  // Load repositories on mount
  onMount(async () => {
    try {
      loading = true;
      repositories = await fetchRepositories();
    } catch (err) {
      error = 'Failed to load repositories';
      console.error(err);
    } finally {
      loading = false;
    }
  });

  // Handle repository selection
  async function handleRepositorySelect(event: CustomEvent<string>) {
    selectedRepositoryId = event.detail;
    if (selectedRepositoryId) {
      await loadCommits(selectedRepositoryId);
    }
  }

  // Handle repository addition
  async function handleRepositoryAdd(event: CustomEvent<string>) {
    try {
      loading = true;
      const newRepo = await addRepository(event.detail);
      repositories = [...repositories, newRepo];
      selectedRepositoryId = newRepo.id;
      await loadCommits(newRepo.id);
    } catch (err) {
      error = 'Failed to add repository';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  // Load commits for a repository
  async function loadCommits(repoId: string) {
    try {
      loading = true;
      commits = await fetchCommits(repoId);
    } catch (err) {
      error = 'Failed to load commit data';
      console.error(err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="container mx-auto p-4 max-w-6xl">
  <h1 class="text-2xl font-bold mb-6">Repository Commit Analysis</h1>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{error}</p>
      <button 
        class="underline ml-2"
        on:click={() => error = null}
      >
        Dismiss
      </button>
    </div>
  {/if}
  
  <div class="mb-6">
    <RepositorySelector
      repositories={repositories}
      repositoryId={selectedRepositoryId}
      loading={loading}
      on:select={handleRepositorySelect}
      on:add={handleRepositoryAdd}
    />
  </div>
  
  <div class="bg-white p-4 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">
      {#if selectedRepositoryId}
        {repositories.find(r => r.id === selectedRepositoryId)?.name || 'Repository'} Commit Activity
      {:else}
        Select a repository to view commit data
      {/if}
    </h2>
    
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else}
      <CommitChart commits={commits} />
    {/if}
  </div>
</div>
