import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import truncateText from './truncateText.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getProjects(searchQuery = '') {
  const projectsDirectory = path.join(process.cwd(), 'public', 'projects');
  
  // Check if directory exists first
  if (!fs.existsSync(projectsDirectory)) {
    console.error('Projects directory not found');
    return [];
  }

  const trimmedQuery = searchQuery.trim().toLowerCase();
  
  try {
    const files = fs.readdirSync(projectsDirectory);
    
    const projects = files.map(filename => {
      const fileContent = fs.readFileSync(
        path.join(projectsDirectory, filename),
        'utf8'
      );
      const { data } = matter(fileContent);
      
      // Truncate first
      const truncatedTitle = truncateText(data.title, 30) || 'Untitled';
      const truncatedDesc = truncateText(data.description, 140) || 'No description';
      
      return {
        title: truncatedTitle,
        description: truncatedDesc,
        rawTitle: data.title,
        rawDescription: data.description.toLowerCase(),
        slug: filename.replace(/\.md$/, '')
      };
    });

    // Filter projects if search query exists
    if (trimmedQuery) {
      const filtered = projects.filter(project => 
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

    return projects;

  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}