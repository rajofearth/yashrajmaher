import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import truncateText from './truncateText.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\/']/g, '\\$&');
}

export function getBlogs(searchQuery = '') {
  const blogsDirectory = path.join(process.cwd(), 'public', 'Bposts');
  if (!fs.existsSync(blogsDirectory)) return [];

  const trimmedQuery = searchQuery.trim().toLowerCase();
  
  try {
    const files = fs.readdirSync(blogsDirectory);

    return files.map(filename => {
      const fileContent = fs.readFileSync(
        path.join(blogsDirectory, filename),
        'utf8'
      );
      const { data } = matter(fileContent);

      // Truncate first
      const truncatedTitle = truncateText(data.title, 30) || 'Untitled';
      const truncatedDesc = truncateText(data.description, 140) || 'No description';

      // Highlight matches
      let highlightedTitle = truncatedTitle;
      let highlightedDesc = truncatedDesc;
      
      if (trimmedQuery) {
        const regex = new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'gi');
        highlightedTitle = truncatedTitle.replace(regex, '<span class="highlight">$1</span>');
        highlightedDesc = truncatedDesc.replace(regex, '<span class="highlight">$1</span>');
      }

      return {
        title: highlightedTitle,
        date: data.date || 'No date',
        description: highlightedDesc,
        rawTitle: data.title,
        rawDescription: data.description.toLowerCase(),
	slug: filename.replace(/\.md$/, '') 
      };
    }).filter(blog => 
      !trimmedQuery || 
      blog.rawTitle.toLowerCase().includes(trimmedQuery) || 
      blog.rawDescription.includes(trimmedQuery)
    ).sort((a, b) => {
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
    console.error('Error reading blog posts:', error);
    return [];
  }
}