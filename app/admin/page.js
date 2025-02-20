'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '../components/TiptapEditor';

export default function AdminPanel() {
  // Authentication state
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');

  // Tab state: "manage" to list posts, "new" to create or edit posts
  const [activeTab, setActiveTab] = useState('manage');

  // Post form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  // Use "blog" or "project"
  const [postType, setPostType] = useState('blog');
  const [content, setContent] = useState(''); // HTML content from TiptapEditor
  const [editingPost, setEditingPost] = useState(null);

  // Posts list state
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const router = useRouter();

  // --- Login Handler ---
  const handleLogin = (e) => {
    e.preventDefault();
    // Make sure you define NEXT_PUBLIC_ADMIN_PASSWORD in your .env.local file!
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchPosts();
    } else {
      setMessage('Incorrect password.');
    }
  };

const fetchPosts = async () => {
  setLoadingPosts(true);
  setMessage('Fetching posts...');
  try {
    const res = await fetch(`/api/listPosts?postType=${encodeURIComponent(postType)}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error fetching posts: ${res.status} - ${errorText}`);
    }
    const data = await res.json();
    setPosts(data.posts || []);
    setMessage('');
  } catch (error) {
    console.error('Error fetching posts:', error);
    setMessage('Error fetching posts: ' + error.message);
  } finally {
    setLoadingPosts(false);
  }
};


  // --- Delete Post ---
const handleDelete = async (filePath) => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  setMessage('Deleting post...');
  try {
    const res = await fetch('/api/deletePost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: `public/${filePath}` }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage('Post deleted successfully.');
      fetchPosts();
    } else {
      setMessage('Error deleting post: ' + data.message);
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    setMessage('Error deleting post: ' + error.message);
  }
};


  // --- Save Post (Create or Update) ---
  const handleSave = async () => {
    if (!title || !description || !content) {
      setMessage('Please fill all fields.');
      return;
    }
    setMessage('Saving post...');
    const filename = `${title.toLowerCase().replace(/ /g, '-')}.md`;
    // For blog posts use Bposts, for projects use projects
    const filePath = editingPost
      ? editingPost.filePath
      : postType === 'blog'
      ? `Bposts/${filename}`
      : `projects/${filename}`;
    const frontmatter = `---\ntitle: "${title}"\ndate: ${date}\ndescription: "${description}"\n---\n\n`;
    const fullContent = frontmatter + content;
    try {
      const res = await fetch('/api/savePost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          content: fullContent,
          postType,
          originalFilePath: editingPost ? editingPost.filePath : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Post saved successfully.');
        // Reset form fields
        setTitle('');
        setDescription('');
        setContent('');
        setEditingPost(null);
        fetchPosts();
        setActiveTab('manage');
      } else {
        setMessage('Error saving post: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage('Error saving post: ' + error.message);
    }
  };

  // --- Edit Post Handler ---
  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setDate(post.date);
    setPostType(post.postType);
    setContent(post.content || '');
    setActiveTab('new');
  };

  // --- UI Rendering ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-80">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Login
          </button>
          {message && <p className="mt-2 text-red-500">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      {/* Tabs */}
      <div className="mb-6 border-b pb-2">
        <button
          onClick={() => {
            setActiveTab('manage');
            fetchPosts();
          }}
          className={`mr-4 pb-2 ${activeTab === 'manage' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
        >
          Manage Posts
        </button>
        <button
          onClick={() => {
            setActiveTab('new');
            setEditingPost(null);
            // Reset form
            setTitle('');
            setDescription('');
            setContent('');
            setDate(new Date().toISOString().split('T')[0]);
          }}
          className={`pb-2 ${activeTab === 'new' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
        >
          New Post
        </button>
      </div>

      {activeTab === 'manage' && (
        <div>
          {loadingPosts ? (
            <p>Loading posts...</p>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  posts.map((post, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="border p-2">{post.name}</td>
                      <td className="border p-2">{post.date || 'N/A'}</td>
                      <td className="border p-2 capitalize">{post.path.includes('Bposts') ? 'blog' : 'project'}</td>
                      <td className="border p-2 space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.path.replace('public/', ''))}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'new' && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{editingPost ? 'Edit Post' : 'New Post'}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Post Type:</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="mt-1 block w-full p-2 border rounded"
            >
              <option value="blog">Blog Post</option>
              <option value="project">Project</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Content:</label>
            <TiptapEditor content={content} setContent={setContent} placeholder="Start writing your post here..." />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Post
          </button>
          {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
      )}
    </div>
  );
}
