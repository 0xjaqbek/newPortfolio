import { getGitHubClient, GITHUB_USERNAME } from './client';

export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export async function fetchContributionStats() {
  try {
    const client = getGitHubClient();

    // Fetch user's events (recent activity)
    const { data: events } = await client.activity.listPublicEventsForUser({
      username: GITHUB_USERNAME,
      per_page: 100,
    });

    // Fetch repositories to get total stars
    const { data: repos } = await client.repos.listForUser({
      username: GITHUB_USERNAME,
      per_page: 100,
    });

    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalRepos = repos.length;

    return {
      totalStars,
      totalRepos,
      recentEvents: events.length,
      lastUpdate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch contribution stats:', error);
    return {
      totalStars: 0,
      totalRepos: 0,
      recentEvents: 0,
      lastUpdate: new Date().toISOString(),
    };
  }
}
