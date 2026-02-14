'use client';

import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaFilter, FaSpinner } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import BlogPostModal from './BlogPostModal';
import { BlogPost } from '@/types/blog';

type FilterStatus = 'all' | 'published' | 'draft';
type SortField = 'title' | 'date' | 'views';
type SortOrder = 'asc' | 'desc';

interface BlogPostsListProps {
  initialPosts: BlogPost[];
}

const BlogPostsList = ({ initialPosts }: BlogPostsListProps) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all'); // FIXED: Added setter
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ======================= HANDLERS ======================= */
  const handleAddNew = () => {
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (postId: string | undefined) => {
    // FIXED: Handle undefined postId
    if (!postId) {
      toast.error('Invalid post ID');
      return;
    }

    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    setDeletingId(postId);

    try {
      const res = await fetch(`/api/blog/${postId}`, { method: 'DELETE' });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to delete' }));
        throw new Error(error.message);
      }

      setPosts(prev => prev.filter(p => p._id !== postId));
      toast.success('Blog post deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete post';
      toast.error(message);
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = (savedPost: BlogPost) => {
    setPosts(prev =>
      selectedPost
        ? prev.map(p => (p._id === savedPost._id ? savedPost : p))
        : [savedPost, ...prev]
    );

    setIsModalOpen(false);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  /* ======================= FILTERING & SORTING ======================= */
  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'all'
          ? true
          : filterStatus === 'published'
          ? post.published
          : !post.published;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'views':
          comparison = (a.views || 0) - (b.views || 0);
          break;
        case 'date':
        default:
          const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
          comparison = dateA - dateB;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  /* ======================= RENDER HELPERS ======================= */
  const renderStatusBadge = (published: boolean) => {
    return published ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Published
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
        Draft
      </span>
    );
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 text-yellow-500">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  /* ======================= UI ======================= */
  return (
    <>
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              aria-label="Search blog posts"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium whitespace-nowrap"
            aria-label="Create new blog post"
          >
            <FaPlus /> New Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaFilter /> Filter:
          </span>
          {(['all', 'published', 'draft'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filterStatus === status
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}

          {/* Results Count */}
          <span className="ml-auto text-sm text-gray-600">
            {filteredAndSortedPosts.length} {filteredAndSortedPosts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {filteredAndSortedPosts.length === 0 ? (
          // FIXED: Empty state
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts found</h3>
            <p className="text-gray-600 text-center mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first blog post'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium"
              >
                <FaPlus /> Create First Post
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSort('title')}
                  >
                    Title {renderSortIcon('title')}
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Author
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th
                    className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSort('views')}
                  >
                    <span className="flex items-center gap-1">
                      <FaEye /> Views {renderSortIcon('views')}
                    </span>
                  </th>
                  <th
                    className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSort('date')}
                  >
                    Date {renderSortIcon('date')}
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedPosts.map(post => (
                  <tr
                    key={post._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-gray-900 line-clamp-1">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {post.excerpt}
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{post.author}</td>
                    <td className="p-4">{renderStatusBadge(post.published)}</td>
                    <td className="p-4 text-gray-700 font-medium">
                      {(post.views || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {formatDate(post.publishedAt || post.createdAt || new Date())}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          aria-label={`Edit ${post.title}`}
                          title="Edit post"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          disabled={deletingId === post._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Delete ${post.title}`}
                          title="Delete post"
                        >
                          {deletingId === post._id ? (
                            <FaSpinner className="text-lg animate-spin" />
                          ) : (
                            <FaTrash className="text-lg" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <BlogPostModal
          post={selectedPost}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default BlogPostsList;