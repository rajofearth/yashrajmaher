import { octokit, repoOwner, repoName } from '@/lib/github';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const getContentSchema = z.object({ path: z.string().min(1) });

export async function GET(request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path');
  
  const result = getContentSchema.safeParse({ path });
  if (!result.success) {
    const messages = result.error.errors.map(e => e.message).join(', ');
    return NextResponse.json({ success: false, message: messages }, { status: 400 });
  }
  
  try {
    const { data } = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path,
    });
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 