import { Octokit } from "@octokit/rest";

const { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } = process.env;

if (!GITHUB_TOKEN) throw new Error("Missing GITHUB_TOKEN");
if (!GITHUB_REPO_OWNER) throw new Error("Missing GITHUB_REPO_OWNER");
if (!GITHUB_REPO_NAME) throw new Error("Missing GITHUB_REPO_NAME");

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export { octokit, GITHUB_REPO_OWNER as repoOwner, GITHUB_REPO_NAME as repoName };
