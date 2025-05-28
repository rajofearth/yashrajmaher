import matter from 'gray-matter';
import { octokit, repoOwner, repoName } from '@/lib/github';
import { NextResponse } from 'next/server';

export async function GET(request) {
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
        path: "public/devposts",
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

    // Fetch each file's content to extract date from frontmatter
    const detailedList = await Promise.all(
      combinedList.map(async item => {
        const { data: fileData } = await octokit.repos.getContent({
          owner: repoOwner,
          repo: repoName,
          path: item.path,
        });
        const content = Buffer.from(fileData.content, 'base64').toString('utf8');
        const { data: fm } = matter(content);
        return { 
          ...item, 
          date: fm.date,
          title: fm.title || '',
          status: fm.status || 'published'
        };
      })
    );

    // Sort by frontmatter date descending
    detailedList.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json(detailedList, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
