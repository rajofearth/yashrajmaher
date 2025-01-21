import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import truncateText from './truncateText.js';

export function getBlogs() {
  const blogsDirectory = path.join(process.cwd(), 'app', '(blogs)', 'blog', '[id]');
  const files = fs.readdirSync(blogsDirectory);
  
  const blogs = files.map(filename => {
    const fileContent = fs.readFileSync(
      path.join(blogsDirectory, filename),
      'utf8'
    );
    const { data } = matter(fileContent);
    
    return {
      title: truncateText(data.title,30) || 'Untitled',
      date: data.date || 'No date',
      description: truncateText(data.description,140)
 || 'No description'
    };
  });

  return blogs;
}