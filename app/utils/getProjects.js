import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import truncateText from './truncateText.js';

export function getProjects() {
  const projectsDirectory = path.join(process.cwd(), 'app/(projects)/p');
  const fileNames = fs.readdirSync(projectsDirectory);
  
  const projects = fileNames.map(fileName => {
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      title: data.title,
      description: truncateText(data.description,140)
    };
  });
  
  return projects;
}