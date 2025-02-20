import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function POST(request) {
  const { path } = await request.json();

  try {
    const repoOwner = process.env.GITHUB_REPO_OWNER;
    const repoName = process.env.GITHUB_REPO_NAME;

    // Retrieve SHA to delete
    const { data } = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path,
    });

    const sha = data.sha;

    await octokit.repos.deleteFile({
      owner: repoOwner,
      repo: repoName,
      path,
      message: `Deleted ${path}`,
      sha,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
