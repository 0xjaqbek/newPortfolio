import { Octokit } from '@octokit/rest';

export function getGitHubClient() {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
}

export const GITHUB_USERNAME = process.env.GITHUB_USERNAME || '0xjaqbek';
