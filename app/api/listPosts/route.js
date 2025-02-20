import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function GET(request) {
  const repoOwner = process.env.GITHUB_REPO_OWNER;
  const repoName = process.env.GITHUB_REPO_NAME;

  try {
    // Fetch blog posts and project files from GitHub
    const [blogsResponse, projectsResponse] = await Promise.all([
      octokit.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path: "public/Bposts",
      }),
      octokit.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path: "public/projects",
      }),
    ]);

    // Parse content for both blogs and projects
    const blogs = blogsResponse.data.map(item => ({
      name: item.name,
      path: item.path,
      type: 'blog',
    }));
    const projects = projectsResponse.data.map(item => ({
      name: item.name,
      path: item.path,
      type: 'project',
    }));

    // Combine and sort by name (or date if available)
    const combinedList = [...blogs, ...projects];

    return new Response(JSON.stringify(combinedList), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}
