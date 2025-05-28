import { octokit, repoOwner, repoName } from '@/lib/github';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const deletePostSchema = z.object({ path: z.string().min(1) });

export async function POST(request) {
  const body = await request.json();
  const result = deletePostSchema.safeParse(body);
  if (!result.success) {
    const messages = result.error.errors.map(e => e.message).join(', ');
    return NextResponse.json({ success: false, message: messages }, { status: 400 });
  }
  const { path } = result.data;

  try {
    // Retrieve SHA to delete
    const { data } = await octokit.repos.getContent({ owner: repoOwner, repo: repoName, path });

    const sha = data.sha;

    await octokit.repos.deleteFile({ owner: repoOwner, repo: repoName, path, message: `Deleted ${path}`, sha });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
