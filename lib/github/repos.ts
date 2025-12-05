import { getGitHubClient, GITHUB_USERNAME } from './client';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export async function fetchPublicRepos(): Promise<GitHubRepo[]> {
  try {
    const client = getGitHubClient();
    const { data } = await client.repos.listForUser({
      username: GITHUB_USERNAME,
      sort: 'updated',
      per_page: 100,
    });

    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language || null,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      topics: repo.topics || [],
      created_at: repo.created_at || new Date().toISOString(),
      updated_at: repo.updated_at || new Date().toISOString(),
      pushed_at: repo.pushed_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return [];
  }
}

export async function fetchRepoReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const client = getGitHubClient();
    const { data } = await client.repos.getReadme({
      owner,
      repo,
    });

    if (data.content) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return content;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch README for ${owner}/${repo}:`, error);
    return null;
  }
}
