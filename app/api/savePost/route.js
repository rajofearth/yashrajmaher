import { octokit, repoOwner, repoName } from '@/lib/github';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const savePostSchema = z.object({
  filePath: z.string().min(1),
  content: z.string().min(1),
  postType: z.enum(['blog', 'project']),
});

export async function POST(request) {
  const body = await request.json();
  const result = savePostSchema.safeParse(body);
  if (!result.success) {
    const messages = result.error.errors.map(e => e.message).join(', ');
    return NextResponse.json({ success: false, message: messages }, { status: 400 });
  }
  const { filePath, content, postType } = result.data;

  try {
    // Check if the file exists to get SHA for update
    let sha = null;
    try {
      const { data } = await octokit.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path: `public/${filePath}`,
      });
      sha = data.sha;
    } catch (error) {
      if (error.status !== 404) throw error;
    }

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: `public/${filePath}`,
      message: `Create/Update ${postType}: ${filePath}`,
      content: Buffer.from(content).toString('base64'),
      sha,
      committer: {
        name: 'Yashraj Maher',
        email: 'rajofearth@proton.me',
      },
      author: {
        name: 'Yashraj Maher',
        email: 'rajofearth@proton.me',
      },
    });

    return NextResponse.json({ success: true, message: 'Post saved successfully', data }, { status: 200 });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}