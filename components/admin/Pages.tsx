'use client';

import { useState, useEffect } from 'react';
// Update the import path below to the correct relative path for your project structure.
// For example, if AdminLayout is in components/admin/AdminLayout.tsx:
import AdminLayout from './AdminLayout';
// Or, if it's in components/AdminLayout.tsx:
// import AdminLayout from '../AdminLayout';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import TiptapEditor from '@/components/TiptapEditor';

interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  author?: string;
}

export default function PageManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    featuredImage: '',
    isPublished: false,
    author: 'Admin',
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPages(data);
        } else {
          console.error('API /api/pages did not return an array:', data);
          setPages([]);
        }
      } else {
        const error = await res.text();
        console.error('Failed to fetch pages:', error);
        setPages([]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Always generate slug if empty
    const slug = formData.slug?.trim() || generateSlug(formData.title);
    if (!formData.title || !slug || !formData.content) {
      alert('Title, slug, and content are required');
      return;
    }

    try {
      const url = editingPage ? `/api/pages/${editingPage._id}` : '/api/pages';
      const method = editingPage ? 'PUT' : 'POST';

      // Check for duplicate slug only on create
      if (!editingPage) {
        const checkRes = await fetch(`/api/pages?slug=${encodeURIComponent(slug)}`);
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          if (checkData && checkData.slug === slug) {
            alert('A page with this slug already exists.');
            return;
          }
        }
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug }),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingPage(null);
        resetForm();
        fetchPages();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPages();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt || '',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      metaKeywords: page.metaKeywords || '',
      featuredImage: page.featuredImage || '',
      isPublished: page.isPublished,
      author: page.author || 'Admin',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      featuredImage: '',
      isPublished: false,
      author: 'Admin',
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Page Management</h1>
          <button
            onClick={() => {
              setEditingPage(null);
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <FaPlus /> Create Page
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Defensive: check if pages is array */}
          {Array.isArray(pages) && pages.map(page => (
            <div
              key={page._id || page.slug || Math.random()}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{page.title}</h3>
                    {page.isPublished ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded flex items-center gap-1">
                        <FaEye /> Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded flex items-center gap-1">
                        <FaEyeSlash /> Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">/{page.slug || ''}</p>
                  {page.excerpt && (
                    <p className="text-sm text-gray-700 line-clamp-2">{page.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    {page.author && <span>By {page.author}</span>}
                    {page.publishedAt && (
                      <>
                        <span>•</span>
                        <span>
                          {new Date(page.publishedAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <a
                    href={`/${page.slug || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="View Page"
                  >
                    <FaEye />
                  </a>
                  <button
                    onClick={() => handleEdit(page)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(page._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Defensive: show message if no pages */}
          {(!Array.isArray(pages) || pages.length === 0) && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No pages found. Create your first page!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingPage ? 'Edit Page' : 'Create Page'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: formData.slug || generateSlug(title),
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                    pattern="[a-z0-9-]+"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /{formData.slug}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <div className="border rounded-lg bg-white">
                  <TiptapEditor
                    content={formData.content}
                    onChange={content => setFormData({ ...formData, content })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  rows={3}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.excerpt.length}/300 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={e => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                      placeholder="Leave blank to use page title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                      rows={2}
                      placeholder="Leave blank to use excerpt"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                    <input
                      type="text"
                      value={formData.metaKeywords}
                      onChange={e => setFormData({ ...formData, metaKeywords: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Publish Page</span>
                </label>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gold text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {editingPage ? 'Update' : 'Create'} Page
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPage(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}