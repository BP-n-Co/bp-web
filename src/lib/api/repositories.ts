// Mock API base URL - replace with actual backend URL when ready
const API_BASE_URL = '/api';

export interface Repository {
  id: string;
  name: string;
}

export interface Commit {
  lines_added: number;
  lines_deleted: number;
  created_date: string;
}

/**
 * Fetch all available repositories
 */
export async function fetchRepositories(): Promise<Repository[]> {
  try {
    // Simulate API request
    // Replace with actual API call: const response = await fetch(`${API_BASE_URL}/repositories`);
    
    // Mock data
    return [
      { id: '1', name: 'github.com/user/repo1' },
      { id: '2', name: 'github.com/user/repo2' },
      { id: '3', name: 'bitbucket.org/user/repo3' }
    ];
    
    // When implementing real API:
    // const data = await response.json();
    // return data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

/**
 * Add a new repository
 */
export async function addRepository(repoName: string): Promise<Repository> {
  try {
    // Simulate API request
    // In a real implementation, use:
    // const response = await fetch(`${API_BASE_URL}/repositories`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ name: repoName })
    // });
    
    // Mock response
    return {
      id: Math.random().toString(36).substring(2, 9),
      name: repoName
    };
    
    // When implementing real API:
    // const data = await response.json();
    // return data;
  } catch (error) {
    console.error('Error adding repository:', error);
    throw error;
  }
}

/**
 * Fetch commit data for a specific repository
 */
export async function fetchCommits(repositoryId: string): Promise<Commit[]> {
  try {
    // Simulate API request
    // Replace with actual API call: 
    // const response = await fetch(`${API_BASE_URL}/repositories/${repositoryId}/commits`);
    
    // Generate mock data
    const today = new Date();
    const commits: Commit[] = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      commits.push({
        lines_added: Math.floor(Math.random() * 200),
        lines_deleted: Math.floor(Math.random() * 100),
        created_date: date.toISOString()
      });
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return commits;
    
    // When implementing real API:
    // const data = await response.json();
    // return data;
  } catch (error) {
    console.error(`Error fetching commits for repository ${repositoryId}:`, error);
    throw error;
  }
} 