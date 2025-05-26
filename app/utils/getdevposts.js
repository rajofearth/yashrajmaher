import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import truncateText from './truncateText.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const DEVPOSTS_DIR = path.join(process.cwd(), 'public', 'devposts');

export function getDevposts(searchQuery = '') {
  try {
    if (!fs.existsSync(DEVPOSTS_DIR)) {
      console.error('Devposts directory not found:', DEVPOSTS_DIR);
      return [];
    }

    const devpostsFiles = fs.readdirSync(DEVPOSTS_DIR).filter(file => 
      file.endsWith('.md') || file.endsWith('.mdx')
    );

    // Read and parse each file
    const devposts = devpostsFiles.map(fileName => {
      // Read file content
      const filePath = path.join(DEVPOSTS_DIR, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter
      const { data: frontmatter, content } = matter(fileContent);
      
      // Get slug from filename (remove extension)
      const slug = fileName.replace(/\.(mdx?|md)$/, '').replace(/\s+/g, '-').toLowerCase();

      // Extract excerpt (first 150 chars)
      const excerpt = content.trim().slice(0, 150) + (content.length > 150 ? '...' : '');

      // Return project data
      return {
        slug,
        rawTitle: frontmatter.title || 'Untitled Project',
        rawDescription: frontmatter.description || excerpt,
        title: frontmatter.title || 'Untitled Project', 
        description: frontmatter.description || excerpt,
        date: frontmatter.date ? new Date(frontmatter.date) : null,
        tags: frontmatter.tags || [],
        website: frontmatter.website || null,
        featuredImage: frontmatter.featuredImage || null,
      };
    });

    // Sort by date (newest first)
    const sortedDevposts = devposts.sort((a, b) => {
      // Handle missing dates
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date - a.date;
    });

    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return sortedDevposts.filter(project => 
        project.title.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query)
      );
    }

    return sortedDevposts;
  } catch (error) {
    console.error('Error fetching devposts:', error);
    return [];
  }
}