'use client';

import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaStar, FaClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
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
  // Tour-specific fields
  type?: 'normal' | 'tour';
  price?: number;
  days?: number;
  nights?: number;
  locations?: number;
  highlights?: string[];
  isPopular?: boolean;
  available?: boolean;
  rating?: number;
  totalReviews?: number;
  inclusions?: string[];
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
    // Tour fields
    type: 'normal' as 'normal' | 'tour',
    price: 0,
    days: 0,
    nights: 0,
    locations: 0,
    highlights: [''],
    isPopular: false,
    available: true,
    rating: 0,
    totalReviews: 0,
    inclusions: [''],
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

      // Clean up highlights and inclusions - remove empty strings
      const cleanedData = {
        ...formData,
        slug,
        highlights: formData.type === 'tour' ? formData.highlights.filter(h => h.trim()) : undefined,
        inclusions: formData.type === 'tour' ? formData.inclusions.filter(i => i.trim()) : undefined,
        // Only include tour fields if type is tour
        ...(formData.type === 'normal' && {
          price: undefined,
          days: undefined,
          nights: undefined,
          locations: undefined,
          isPopular: undefined,
          available: undefined,
          rating: undefined,
          totalReviews: undefined,
        }),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
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
      type: page.type || 'normal',
      price: page.price || 0,
      days: page.days || 0,
      nights: page.nights || 0,
      locations: page.locations || 0,
      highlights: page.highlights && page.highlights.length > 0 ? page.highlights : [''],
      isPopular: page.isPopular || false,
      available: page.available !== undefined ? page.available : true,
      rating: page.rating || 0,
      totalReviews: page.totalReviews || 0,
      inclusions: page.inclusions && page.inclusions.length > 0 ? page.inclusions : [''],
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
      type: 'normal',
      price: 0,
      days: 0,
      nights: 0,
      locations: 0,
      highlights: [''],
      isPopular: false,
      available: true,
      rating: 0,
      totalReviews: 0,
      inclusions: [''],
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const addInclusion = () => {
    setFormData({ ...formData, inclusions: [...formData.inclusions, ''] });
  };

  const removeInclusion = (index: number) => {
    const newInclusions = formData.inclusions.filter((_, i) => i !== index);
    setFormData({ ...formData, inclusions: newInclusions });
  };

  const updateInclusion = (index: number, value: string) => {
    const newInclusions = [...formData.inclusions];
    newInclusions[index] = value;
    setFormData({ ...formData, inclusions: newInclusions });
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

  const normalPages = pages.filter(p => !p.type || p.type === 'normal');
  const tourPages = pages.filter(p => p.type === 'tour');

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

        {/* Normal Pages Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Normal Pages</h2>
          <div className="grid grid-cols-1 gap-4">
            {normalPages.map(page => (
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
                          <span>{new Date(page.publishedAt).toLocaleDateString()}</span>
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
            {normalPages.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No normal pages found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tour Packages Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Tour Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourPages.map(tour => (
              <div
                key={tour._id || tour.slug || Math.random()}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
              >
                {/* Popular Badge */}
                {tour.isPopular && (
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    Most Popular
                  </div>
                )}

                {/* Available Badge */}
                <div className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg">
                  {tour.available ? (
                    <FaCheckCircle className="text-green-500 text-xl" title="Available" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-xl" title="Not Available" />
                  )}
                </div>

                {/* Featured Image */}
                {tour.featuredImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={tour.featuredImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
                    {tour.title}
                  </h3>

                  {/* Duration and Locations */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {(tour.days || tour.nights) && (
                      <div className="flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        <span>{tour.days || 0} Days {tour.nights || 0} Nights</span>
                      </div>
                    )}
                    {tour.locations && (
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{tour.locations} Locations</span>
                      </div>
                    )}
                  </div>

                  {/* Excerpt */}
                  {tour.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">{tour.excerpt}</p>
                  )}

                  {/* Highlights */}
                  {tour.highlights && tour.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {tour.highlights.slice(0, 3).map((highlight, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="line-clamp-1">{highlight}</span>
                        </li>
                      ))}
                      {tour.highlights.length > 3 && (
                        <li className="text-sm text-gray-500 italic">+{tour.highlights.length - 3} more</li>
                      )}
                    </ul>
                  )}

                  {/* Rating */}
                  {tour.rating && tour.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(tour.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{tour.rating}</span>
                      {tour.totalReviews && (
                        <span className="text-xs text-gray-500">({tour.totalReviews} reviews)</span>
                      )}
                    </div>
                  )}

                  {/* Inclusions Preview */}
                  {tour.inclusions && tour.inclusions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      {tour.inclusions.slice(0, 2).map((inc, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          ✓ {inc}
                        </span>
                      ))}
                      {tour.inclusions.length > 2 && (
                        <span className="text-xs text-gray-500">+{tour.inclusions.length - 2} more</span>
                      )}
                    </div>
                  )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      {tour.price !== undefined && tour.price > 0 && (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-green-600">₹{tour.price.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">per person</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`/${tour.slug || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </a>
                      <button
                        onClick={() => handleEdit(tour)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(tour._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Status Badge at Bottom */}
                  <div className="pt-2">
                    {tour.isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        <FaEye /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        <FaEyeSlash /> Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {tourPages.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No tour packages found. Create your first tour!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-6xl w-full max-h-[95vh] overflow-y-auto my-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingPage ? 'Edit Page' : 'Create Page'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Page Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Page Type *</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as 'normal' | 'tour' })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  required
                >
                  <option value="normal">Normal Page</option>
                  <option value="tour">Tour Package</option>
                </select>
              </div>

              {/* Basic Information */}
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
                  <p className="text-xs text-gray-500 mt-1">URL: /{formData.slug}</p>
                </div>
              </div>

              {/* Tour-Specific Fields */}
              {formData.type === 'tour' && (
                <div className="space-y-4 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Tour Package Details</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Days</label>
                      <input
                        type="number"
                        value={formData.days}
                        onChange={e => setFormData({ ...formData, days: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Nights</label>
                      <input
                        type="number"
                        value={formData.nights}
                        onChange={e => setFormData({ ...formData, nights: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Locations</label>
                      <input
                        type="number"
                        value={formData.locations}
                        onChange={e => setFormData({ ...formData, locations: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating (0-5)</label>
                      <input
                        type="number"
                        value={formData.rating}
                        onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Total Reviews</label>
                      <input
                        type="number"
                        value={formData.totalReviews}
                        onChange={e => setFormData({ ...formData, totalReviews: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isPopular}
                          onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Popular</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.available}
                          onChange={e => setFormData({ ...formData, available: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Available</span>
                      </label>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Tour Highlights</label>
                    <div className="space-y-2">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={highlight}
                            onChange={e => updateHighlight(index, e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                            placeholder="Enter highlight"
                          />
                          {formData.highlights.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHighlight(index)}
                              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addHighlight}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      >
                        <FaPlus /> Add Highlight
                      </button>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Inclusions</label>
                    <div className="space-y-2">
                      {formData.inclusions.map((inclusion, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={inclusion}
                            onChange={e => updateInclusion(index, e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                            placeholder="e.g., Accommodation, All meals, Private transport"
                          />
                          {formData.inclusions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeInclusion(index)}
                              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addInclusion}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      >
                        <FaPlus /> Add Inclusion
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <div className="border rounded-lg bg-white">
                  <TiptapEditor
                    content={formData.content}
                    onChange={content => setFormData({ ...formData, content })}
                  />
                </div>
              </div>

              {/* Excerpt */}
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

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={e => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.featuredImage && (
                  <div className="mt-2">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* SEO Settings */}
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

              {/* Author and Publish */}
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

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gold text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
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
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
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