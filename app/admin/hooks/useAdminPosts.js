'use client';

import { useState, useEffect } from 'react';

export function useAdminPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: 'all', status: 'all' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/listPosts');
      if (response.ok) {
        const data = await response.json();
        const postsWithStatus = data.map(post => {
          if (post.status) return post;
          if (post.date) {
            return { ...post, status: post.status || 'published' };
          }
          return { ...post, status: 'draft' };
        });
        setPosts(postsWithStatus);
        setFilteredPosts(postsWithStatus);
        setError('');
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError('Error fetching posts: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response = await fetch('/api/deletePost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: deleteTarget }),
      });
      if (response.ok) {
        setDeleteTarget(null);
        fetchPosts();
        setError('');
      } else {
        const data = await response.json();
        setError('Failed to delete post: ' + data.message);
      }
    } catch (err) {
      setError('Error deleting post: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!posts.length) return;
    let filtered = [...posts];

    if (searchQuery) {
      filtered = filtered.filter(post => {
        const title = post.title ? post.title.toLowerCase() : '';
        const filename = post.name.toLowerCase();
        return title.includes(searchQuery.toLowerCase()) || filename.includes(searchQuery.toLowerCase());
      });
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(post => {
        if (filters.category === 'blog') return post.type === 'blog';
        if (filters.category === 'project') return post.type === 'project';
        return true;
      });
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(post => post.status === filters.status);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, filters, posts]);

  return {
    filteredPosts,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    isLoading,
    error,
    isDeleting,
    deleteTarget,
    setDeleteTarget,
    fetchPosts,
    handleDeleteConfirm,
  };
} 