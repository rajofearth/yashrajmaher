import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import truncateText from './truncateText.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getdevposts(searchQuery = '') {
  const devpostsDirectory = path.join(process.cwd(), 'public', 'devposts');
  
  // Check if directory exists first
  if (!fs.existsSync(devpostsDirectory)) {
    console.error('devposts directory not found');
    return [];
  }

  const trimmedQuery = searchQuery.trim().toLowerCase();
  
  try {
    const files = fs.readdirSync(devpostsDirectory);
    
    const devposts = files.map(filename => {
      const fileContent = fs.readFileSync(
        path.join(devpostsDirectory, filename),
        'utf8'
      );
      const { data } = matter(fileContent);
      
      // Truncate first
      const truncatedTitle = truncateText(data.title, 30) || 'Untitled';
      const truncatedDesc = truncateText(data.description, 140) || 'No description';
      
      return {
        title: truncatedTitle,
        date: data.date || 'No date',
        description: truncatedDesc,
        rawTitle: data.title,
        rawDescription: data.description.toLowerCase(),
        tags: data.tags || [],
        slug: filename.replace(/\.md$/, '')
      };
    });

    // Filter devposts if search query exists
    if (trimmedQuery) {
      const filtered = devposts.filter(project => 
        project.rawTitle.toLowerCase().includes(trimmedQuery) ||
        project.rawDescription.includes(trimmedQuery)
      );

      // Add highlighting to filtered results
      return filtered.map(project => ({
        ...project,
        title: project.title.replace(
          new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'gi'),
          '<span class="highlight">$1</span>'
        ),
        description: project.description.replace(
          new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'gi'),
          '<span class="highlight">$1</span>'
        )
      }));
    }

    return devposts.sort((a, b) => {
      try {
        // Handle invalid dates by falling back to string comparison
        const dateA = a.date && a.date !== 'No date' ? new Date(a.date).getTime() : 0;
        const dateB = b.date && b.date !== 'No date' ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      } catch (error) {
        // If date comparison fails, don't change order
        return 0;
      }
    });

  } catch (error) {
    console.error('Error reading devposts:', error);
    return [];
  }
}