import { Octokit } from "@octokit/rest";
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { filePath, content, postType } = await request.json();
  if (!filePath || !content || !postType) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    try {
        // Check if the file exists
        let sha = null;
        try {
            const { data } = await octokit.repos.getContent({
                owner: process.env.GITHUB_REPO_OWNER,
                repo: process.env.GITHUB_REPO_NAME,
                path: `public/${filePath}`,
            });
            sha = data.sha; // Get the SHA for updating
        } catch (error) {
            if (error.status !== 404) { // Ignore 404 (file doesn't exist)
                throw error;
            }
        }

        // Create or update the file
        const { data } = await octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_REPO_OWNER,
            repo: process.env.GITHUB_REPO_NAME,
            path: `public/${filePath}`,
            message: `Create/Update ${postType}: ${filePath}`,
            content: Buffer.from(content).toString('base64'),
            sha: sha, // Include SHA if updating
            committer: {
              name: 'Yashraj Maher',
              email: 'rajofearth@proton.me' // Replace
            },
            author: {
              name: 'Yashraj Maher',
              email: 'rajofearth@proton.me' // Replace
            }
        });

      return NextResponse.json({ success: true, message: 'Post saved successfully', data }, { status: 200 });
    } catch (error) {
        console.error('GitHub API Error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}