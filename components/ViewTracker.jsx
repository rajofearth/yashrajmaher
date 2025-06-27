'use client';

import { useEffect, useState } from 'react';
import { trackPostView } from '@/app/actions/views';

export default function ViewTracker({ postSlug, initialViews }) {
  const [views, setViews] = useState(initialViews || 0);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    // Only track once per component mount
    if (isTracked || !postSlug) return;

    const trackView = async () => {
      try {
        // Add a small delay to ensure the page is loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const result = await trackPostView(postSlug);
        
        if (result.success) {
          setViews(result.views);
          console.log('View tracked successfully');
        } else {
          console.log('View not tracked:', result.reason);
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      } finally {
        setIsTracked(true);
      }
    };

    trackView();
  }, [postSlug, isTracked]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <svg 
        className="h-4 w-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
        />
      </svg>
      <span>{views.toLocaleString()} views</span>
    </div>
  );
} 