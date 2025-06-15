import matter from 'gray-matter';
import { octokit, repoOwner, repoName } from './github';

// Tool definitions for the chat agent
export const CHAT_TOOLS = [
  {
    type: "function",
    function: {
      name: "search_blog_posts",
      description: "Search through blog posts by title, content, tags, or date. Use this when users ask about blog posts, articles, or written content.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for blog posts (can be title, topic, or keywords)"
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return (default: 5)",
            default: 5
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_dev_posts",
      description: "Search through development posts/projects by title, content, technologies, or date. Use this when users ask about projects, code, or development work.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for dev posts (can be title, technology, or keywords)"
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return (default: 5)",
            default: 5
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_post_content",
      description: "Get the full content of a specific blog post or dev post. Use this when users want to read a specific post or need detailed information.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "The file path of the post to retrieve"
          }
        },
        required: ["path"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_latest_posts",
      description: "Get the latest blog posts and dev posts. Use this when users ask for recent content or what's new.",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["blog", "dev", "both"],
            description: "Type of posts to retrieve (default: both)",
            default: "both"
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return (default: 5)",
            default: 5
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_author_info",
      description: "Get information about the author (Yashraj Maher). Use this when users ask about the author, bio, or personal information.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  }
];

// Helper function to extract text content from markdown
const extractTextFromMarkdown = (content) => {
  // Remove frontmatter
  const { content: markdown } = matter(content);
  
  // Remove markdown syntax for better searching
  return markdown
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images, keep alt text
    .toLowerCase();
};

// Search function for posts
const searchPosts = async (directory, query, limit = 5) => {
  try {
    const response = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path: directory,
    });

    const posts = await Promise.all(
      response.data.map(async (item) => {
        const { data: fileData } = await octokit.repos.getContent({
          owner: repoOwner,
          repo: repoName,
          path: item.path,
        });
        
        const content = Buffer.from(fileData.content, 'base64').toString('utf8');
        const { data: frontmatter, content: markdown } = matter(content);
        const textContent = extractTextFromMarkdown(content);
        
        return {
          path: item.path,
          name: item.name,
          title: frontmatter.title || '',
          date: frontmatter.date,
          tags: frontmatter.tags || [],
          excerpt: frontmatter.excerpt || '',
          content: textContent,
          frontmatter,
          wordCount: textContent.split(/\s+/).length
        };
      })
    );

    // Search in title, content, tags, and excerpt
    const searchTerms = query.toLowerCase().split(/\s+/);
    const filteredPosts = posts.filter(post => {
      const searchableText = [
        post.title,
        post.excerpt,
        post.content,
        ...(post.tags || [])
      ].join(' ').toLowerCase();
      
      return searchTerms.some(term => searchableText.includes(term));
    });

    // Sort by relevance (number of matching terms) and date
    const sortedPosts = filteredPosts
      .map(post => {
        const searchableText = [post.title, post.excerpt, post.content, ...(post.tags || [])].join(' ').toLowerCase();
        const relevanceScore = searchTerms.reduce((score, term) => {
          const matches = (searchableText.match(new RegExp(term, 'g')) || []).length;
          return score + matches;
        }, 0);
        
        return { ...post, relevanceScore };
      })
      .sort((a, b) => {
        if (a.relevanceScore !== b.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(b.date) - new Date(a.date);
      })
      .slice(0, limit)
      .map(({ content, ...post }) => ({
        ...post,
        preview: post.excerpt || content.substring(0, 200) + '...'
      }));

    return sortedPosts;
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};

// Tool implementation functions
export const toolFunctions = {
  search_blog_posts: async ({ query, limit = 5 }) => {
    const posts = await searchPosts('public/Bposts', query, limit);
    return {
      success: true,
      data: posts,
      message: `Found ${posts.length} blog post(s) matching "${query}"`
    };
  },

  search_dev_posts: async ({ query, limit = 5 }) => {
    const posts = await searchPosts('public/devposts', query, limit);
    return {
      success: true,
      data: posts,
      message: `Found ${posts.length} dev post(s) matching "${query}"`
    };
  },

  get_post_content: async ({ path }) => {
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path,
      });
      
      const content = Buffer.from(fileData.content, 'base64').toString('utf8');
      const { data: frontmatter, content: markdown } = matter(content);
      
      return {
        success: true,
        data: {
          path,
          frontmatter,
          content: markdown,
          wordCount: markdown.split(/\s+/).length
        },
        message: `Retrieved content for: ${frontmatter.title || path}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving post: ${error.message}`
      };
    }
  },

  get_latest_posts: async ({ type = 'both', limit = 5 }) => {
    try {
      const posts = [];
      
      if (type === 'blog' || type === 'both') {
        const blogResponse = await octokit.repos.getContent({
          owner: repoOwner,
          repo: repoName,
          path: 'public/Bposts',
        });
        
        const blogPosts = await Promise.all(
          blogResponse.data.map(async (item) => {
            const { data: fileData } = await octokit.repos.getContent({
              owner: repoOwner,
              repo: repoName,
              path: item.path,
            });
            
            const content = Buffer.from(fileData.content, 'base64').toString('utf8');
            const { data: frontmatter } = matter(content);
            
            return {
              path: item.path,
              name: item.name,
              title: frontmatter.title || '',
              date: frontmatter.date,
              type: 'blog',
              excerpt: frontmatter.excerpt || '',
              tags: frontmatter.tags || []
            };
          })
        );
        
        posts.push(...blogPosts);
      }
      
      if (type === 'dev' || type === 'both') {
        const devResponse = await octokit.repos.getContent({
          owner: repoOwner,
          repo: repoName,
          path: 'public/devposts',
        });
        
        const devPosts = await Promise.all(
          devResponse.data.map(async (item) => {
            const { data: fileData } = await octokit.repos.getContent({
              owner: repoOwner,
              repo: repoName,
              path: item.path,
            });
            
            const content = Buffer.from(fileData.content, 'base64').toString('utf8');
            const { data: frontmatter } = matter(content);
            
            return {
              path: item.path,
              name: item.name,
              title: frontmatter.title || '',
              date: frontmatter.date,
              type: 'dev',
              excerpt: frontmatter.excerpt || '',
              tags: frontmatter.tags || []
            };
          })
        );
        
        posts.push(...devPosts);
      }
      
      // Sort by date and limit
      const sortedPosts = posts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
      
      return {
        success: true,
        data: sortedPosts,
        message: `Retrieved ${sortedPosts.length} latest posts`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving latest posts: ${error.message}`
      };
    }
  },

  get_author_info: async () => {
    return {
      success: true,
      data: {
        name: "Yashraj Maher",
        role: "Full Stack Developer & Content Creator",
        bio: "Passionate developer who loves creating innovative web applications and sharing knowledge through blog posts and development tutorials. Specializes in modern web technologies including React, Next.js, and backend development.",
        expertise: ["Full Stack Development", "React/Next.js", "JavaScript/TypeScript", "Web Technologies", "Content Creation"],
        website: process.env.NEXT_PUBLIC_SITE_URL || "https://yashrajmaher.com",
        social: {
          github: "https://github.com/yashrajmaher",
          twitter: "https://twitter.com/yashrajmaher",
          linkedin: "https://linkedin.com/in/yashrajmaher"
        }
      },
      message: "Author information retrieved successfully"
    };
  }
}; 