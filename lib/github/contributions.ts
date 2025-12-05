import { GITHUB_USERNAME } from './client';

export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionData {
  weeks: ContributionWeek[];
  totalContributions: number;
}

export async function fetchContributionStats() {
  try {
    const token = process.env.GITHUB_TOKEN;

    // Use GitHub GraphQL API for contribution data
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      throw new Error('No contribution data available');
    }

    const weeks: ContributionWeek[] = calendar.weeks.map((week: any) => ({
      days: week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'].indexOf(day.contributionLevel),
      })),
    }));

    return {
      weeks,
      totalContributions: calendar.totalContributions,
    };
  } catch (error) {
    console.error('Failed to fetch contribution stats:', error);
    return {
      weeks: [],
      totalContributions: 0,
    };
  }
}
