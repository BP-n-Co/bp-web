<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  interface Props {
    repositoryId?: string | null;
    repositories?: Array<{ id: string, name: string }>;
    loading?: boolean;
    onSelect?: (value: string) => void;
    onAdd?: (repoName: string) => void;
  }

  let { repositoryId = null, repositories = [], loading = false, onSelect, onAdd }: Props = $props();

  let showModal = $state(false);
  let newRepositoryName = $state('');

  function selectRepository(event: Event) {
    const select = event.target as HTMLSelectElement;
    onSelect?.(select.value);
  }

  function toggleModal() {
    showModal = !showModal;
    if (!showModal) {
      newRepositoryName = '';
    }
  }

  function submitRepository() {
    if (newRepositoryName.trim()) {
      onAdd?.(newRepositoryName.trim());
      toggleModal();
    }
  }
</script>

<div class="repository-selector">
  <div class="flex gap-4 items-center">
    <div class="flex-grow">
      <select 
        class="w-full p-2 border rounded" 
        onchange={selectRepository} 
        disabled={loading}
        value={repositoryId || ''}
      >
        <option value="" disabled selected={!repositoryId}>Select a repository</option>
        {#each repositories as repo}
          <option value={repo.id} selected={repositoryId === repo.id}>{repo.name}</option>
        {/each}
      </select>
    </div>
    <button 
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onclick={toggleModal}
      disabled={loading}
    >
      Add Repository
    </button>
  </div>
</div>

{#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Add New Repository</h2>
      <form onsubmit={preventDefault(submitRepository)}>
        <div class="mb-4">
          <label class="block mb-2" for="repo-name">Repository Name (domain/name)</label>
          <input
            id="repo-name"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="github.com/username/repository"
            bind:value={newRepositoryName}
            required
          />
        </div>
        <div class="flex justify-end gap-2">
          <button 
            type="button"
            class="px-4 py-2 border rounded hover:bg-gray-100"
            onclick={toggleModal}
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
{/if} 