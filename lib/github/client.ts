import { Octokit } from '@octokit/rest';

export function getGitHubClient() {
  const token = process.env.GITHUB_TOKEN;

  return new Octokit(
    token ? { auth: token } : {}
  );
}

export const GITHUB_USERNAME = process.env.GITHUB_USERNAME || '0xjaqbek';
