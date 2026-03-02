"use client";

import React, { useState, useMemo } from 'react';
import { PostCard } from '../PostCard';

interface BlogListWithFiltersProps {
  posts: any[];
}

export function BlogListWithFilters({ posts }: BlogListWithFiltersProps) {
  const [activeTag, setActiveTag] = useState<string>('All');
  console.log({posts})


  // Extract all unique tags
  const tags = useMemo(() => {
    const allTags = new Set<string>();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => allTags.add(tag));
      }
    });
    return ['All', ...Array.from(allTags)];
  }, [posts]);

  // Filter posts based on active tag
  const filteredPosts = useMemo(() => {
    if (activeTag === 'All') return posts;
    return posts.filter(post => post.tags?.includes(activeTag));
  }, [posts, activeTag]);

  return (
    <div>
      {/* Scrollable Tabs Container */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-10 scrollbar-hide border-b border-gray-200 dark:border-gray-800">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-200 ${
              activeTag === tag
                ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-md border border-transparent'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:border-gray-700'
            }`}
          >
            {tag === 'All' ? 'All Posts' : tag}
          </button>
        ))}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found with the tag "{activeTag}".</p>
          <button 
            onClick={() => setActiveTag('All')}
            className="mt-6 px-6 py-2 bg-white dark:bg-gray-800 text-[#0A2540] dark:text-white font-medium rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
