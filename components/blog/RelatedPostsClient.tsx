"use client";

import { useState } from "react";
import Link from 'next/link';

interface Post {
  _id?: string;
  id?: string | number;
  title: string;
  excerpt?: string;
  summary?: string;
  slug?: string;
}

interface RelatedPostsClientProps {
  posts: Post[];
}

export default function RelatedPostsClient({ posts }: RelatedPostsClientProps) {
  const [visibleCount, setVisibleCount] = useState(3);

  // Function to show more posts
  const showMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  // Slice posts to only show visible ones
  const visiblePosts = posts.slice(0, visibleCount);

  // Debugging
  console.log("All posts:", posts);
  console.log("Visible posts:", visiblePosts);

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-8">
        {visiblePosts.map((post, idx) => {
          const key = (post as any)._id ?? (post as any).id ?? idx;
          const summary = post.excerpt ?? post.summary ?? '';
          const href = post.slug ? `/blog/${post.slug}` : `/blog/${key}`;

          return (
            <div key={String(key)} className="border p-4 rounded-lg">
              <h2 className="font-bold text-lg">
                <Link href={href} className="hover:text-gold">
                  {post.title}
                </Link>
              </h2>
              <p>{summary}</p>
            </div>
          );
        })}
      </div>

      {/* Show More Button */}
      {visibleCount < posts.length && (
        <div className="text-center mt-8">
          <button
            onClick={showMore}
            className="bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
