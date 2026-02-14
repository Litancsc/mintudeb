'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaTag, FaFolder, FaUpload, FaKey } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { slugify } from '@/lib/utils';
import TiptapEditor from '../TiptapEditor';
import { BlogPost } from '@/types/blog';

interface BlogPostModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSave: (post: BlogPost) => void;
}

const SEO_MAX_TITLE = 60;
const SEO_MAX_DESC = 160;

const emptyPost: BlogPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  author: 'DriveNow Team',
  categories: [],
  tags: [],
  published: false,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: [],
  views: 0, // FIXED: Added missing views field
};

const BlogPostModal = ({ post, onClose, onSave }: BlogPostModalProps) => {
  const [activeTab, setActiveTab] = useState<'content' | 'meta' | 'categories'>('content');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<BlogPost>(emptyPost);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  /* ======================= INIT ======================= */
  useEffect(() => {
    if (post) {
      setFormData(post);
    } else {
      setFormData(emptyPost);
    }
    setErrors({});
  }, [post]);

  /* ======================= VALIDATION ======================= */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (formData.excerpt.length > 300) newErrors.excerpt = 'Excerpt must be under 300 characters';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.featuredImage.trim()) newErrors.featuredImage = 'Featured image is required';

    if (formData.metaTitle && formData.metaTitle.length > SEO_MAX_TITLE) {
      newErrors.metaTitle = `Meta title must be under ${SEO_MAX_TITLE} characters`;
    }

    if (formData.metaDescription && formData.metaDescription.length > SEO_MAX_DESC) {
      newErrors.metaDescription = `Meta description must be under ${SEO_MAX_DESC} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ======================= HANDLERS ======================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === 'title' && !post ? slugify(value) : prev.slug,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // FIXED: Image upload handler now properly implemented
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      
      // Replace with your actual upload endpoint
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!res.ok) throw new Error('Upload failed');

      const { url } = await res.json();
      
      setFormData(prev => ({ ...prev, featuredImage: url }));
      
      if (errors.featuredImage) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.featuredImage;
          return newErrors;
        });
      }

      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // FIXED: Add/remove handlers for categories
  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !formData.categories.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, trimmed],
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== cat),
    }));
  };

  // FIXED: Add/remove handlers for tags
  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  // FIXED: Add/remove handlers for keywords
  const addKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed && !formData.metaKeywords?.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...(prev.metaKeywords || []), trimmed],
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords?.filter(k => k !== keyword) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        post?._id ? `/api/blog/${post._id}` : '/api/blog',
        {
          method: post ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error('Failed to save post');

      const savedPost: BlogPost = await res.json();
      toast.success(post ? 'Post updated successfully' : 'Post created successfully');
      onSave(savedPost);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ======================= UI ======================= */
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {post ? 'Edit Blog Post' : 'New Blog Post'}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        </header>

        {/* Tabs */}
        <nav className="flex border-b bg-gray-50 sticky top-[73px] z-10">
          {(['content', 'meta', 'categories'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 font-semibold transition ${
                activeTab === tab
                  ? 'border-b-4 border-yellow-500 text-yellow-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-6">
          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog post title"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="url-friendly-slug"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <input
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs ml-2">
                    ({formData.excerpt.length}/300)
                  </span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief description of the post"
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.excerpt ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <TiptapEditor
                  content={formData.content}
                  onChange={content => {
                    setFormData(prev => ({ ...prev, content }));
                    if (errors.content) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.content;
                        return newErrors;
                      });
                    }
                  }}
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <input
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    placeholder="Image URL"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.featuredImage ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">or</span>
                    <label className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}>
                      <FaUpload className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {errors.featuredImage && <p className="text-red-500 text-sm">{errors.featuredImage}</p>}

                  {formData.featuredImage && (
                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="h-48 w-full object-cover rounded-lg border border-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* FIXED: Published Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Publish this post
                </label>
              </div>
            </>
          )}

          {/* META TAB */}
          {activeTab === 'meta' && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>SEO Tip:</strong> Optimize your meta tags to improve search engine visibility.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                  <span className="text-gray-500 text-xs ml-2">
                    ({(formData.metaTitle?.length || 0)}/{SEO_MAX_TITLE})
                  </span>
                </label>
                <input
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  maxLength={SEO_MAX_TITLE}
                  placeholder="SEO-optimized title"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.metaTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.metaTitle && <p className="text-red-500 text-sm mt-1">{errors.metaTitle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                  <span className="text-gray-500 text-xs ml-2">
                    ({(formData.metaDescription?.length || 0)}/{SEO_MAX_DESC})
                  </span>
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  maxLength={SEO_MAX_DESC}
                  placeholder="Brief description for search engines"
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.metaDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.metaDescription && <p className="text-red-500 text-sm mt-1">{errors.metaDescription}</p>}
              </div>

              {/* FIXED: Meta Keywords with add/remove */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaKey className="inline mr-2" />
                  Meta Keywords
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
                    placeholder="Add keyword"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.metaKeywords || []).map(keyword => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      <FaKey className="text-xs" />
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* CATEGORIES TAB - FIXED: Complete implementation */}
          {activeTab === 'categories' && (
            <>
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFolder className="inline mr-2" />
                  Categories
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Add category"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.categories.map(cat => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      <FaFolder className="text-xs" />
                      {cat}
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaTag className="inline mr-2" />
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      <FaTag className="text-xs" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-center gap-4 p-6 border-t bg-gray-50 sticky bottom-0">
          <div className="text-sm text-gray-600">
            {Object.keys(errors).length > 0 && (
              <span className="text-red-500">
                Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogPostModal;