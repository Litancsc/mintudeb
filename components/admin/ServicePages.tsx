'use client';

import { useState, useEffect,  } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';

interface ServicePage {
  _id: string;
  title: string;
  serviceSlug: string;
  locationSlug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  featuredImage?: string;
  isPublished: boolean;
  author?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ServicePagesAdmin() {
  const [servicePages, setServicePages] = useState<ServicePage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ServicePage | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    serviceSlug: '',
    locationSlug: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    featuredImage: '',
    isPublished: false,
    author: '',
  });

  // TipTap Editor
 const editor = useEditor({
  extensions: [
    StarterKit,
    Heading.configure({ levels: [1, 2, 3] }),
    Link.configure({ openOnClick: true }),
    Image,
    Placeholder.configure({ placeholder: 'Write content here...' }),
  ],
  content: formData.content,
  onUpdate: ({ editor }) =>
    setFormData((prev) => ({ ...prev, content: editor.getHTML() })),
  editorProps: {
    attributes: { class: 'outline-none' },
  },
  // ❌ This is the important fix:
  immediatelyRender: false,
});

  // Fetch service pages
  const fetchServicePages = async () => {
    try {
      const res = await fetch('/api/service-pages');
      if (res.ok) {
        const data = await res.json();
        setServicePages(data);
      }
    } catch (error) {
      console.error('Error fetching service pages:', error);
    }
  };

  useEffect(() => {
    fetchServicePages();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      serviceSlug: '',
      locationSlug: '',
      content: '',
      excerpt: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      featuredImage: '',
      isPublished: false,
      author: '',
    });
    setEditingPage(null);
    editor?.commands.clearContent();
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceSlug || !formData.locationSlug) {
      alert('Service Slug and Location Slug are required!');
      return;
    }
    if (!formData.title || !formData.content) {
      alert('Title and Content are required!');
      return;
    }

    setLoading(true);

    try {
      const url = editingPage
        ? `/api/service-pages/${editingPage._id}`
        : '/api/service-pages';
      const method = editingPage ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingPage ? 'Page updated!' : 'Page created!');
        setIsModalOpen(false);
        resetForm();
        fetchServicePages();
      } else {
        const error = await res.json();
        alert(error.message || 'Error saving page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page');
    } finally {
      setLoading(false);
    }
  };

  // Edit page
  const handleEdit = (page: ServicePage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      serviceSlug: page.serviceSlug,
      locationSlug: page.locationSlug,
      content: page.content,
      excerpt: page.excerpt || '',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      metaKeywords: page.metaKeywords || '',
      featuredImage: page.featuredImage || '',
      isPublished: page.isPublished,
      author: page.author || '',
    });
    editor?.commands.setContent(page.content);
    setIsModalOpen(true);
  };

  // Delete page
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/service-pages/${id}`, { method: 'DELETE' });
      if (res.ok) fetchServicePages();
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  // Image upload
  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await fetch('/api/upload-image', { method: 'POST', body: data });
      const result = await res.json();
      if (result.url) editor?.chain().focus().setImage({ src: result.url }).run();
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Service Pages</h1>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Page
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {servicePages.map((page) => (
              <tr key={page._id}>
                <td className="px-6 py-4">{page.title}</td>
                <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{page.serviceSlug}</span></td>
                <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-green-100 text-green-800 rounded">{page.locationSlug}</span></td>
                <td className="px-6 py-4 text-sm text-gray-500">/services/{page.serviceSlug}/{page.locationSlug}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {page.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button onClick={() => handleEdit(page)} className="text-blue-600 hover:text-blue-900">Edit</button>
                  <button onClick={() => handleDelete(page._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  <a href={`/services/${page.serviceSlug}/${page.locationSlug}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingPage ? 'Edit Page' : 'Create Page'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Slugs */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded">
                <div>
                  <label className="block text-sm font-medium mb-1">Service Slug *</label>
                  <input
                    type="text"
                    value={formData.serviceSlug}
                    onChange={(e) => setFormData({ ...formData, serviceSlug: e.target.value.toLowerCase().trim() })}
                    className="w-full border rounded px-3 py-2"
                    required pattern="^[a-z0-9-]+$"
                    title="Lowercase letters, numbers, hyphens only"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location Slug *</label>
                  <input
                    type="text"
                    value={formData.locationSlug}
                    onChange={(e) => setFormData({ ...formData, locationSlug: e.target.value.toLowerCase().trim() })}
                    className="w-full border rounded px-3 py-2"
                    required pattern="^[a-z0-9-]+$"
                  />
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-blue-700">
                    URL: /services/{formData.serviceSlug || '[service]'}/{formData.locationSlug || '[location]'}
                  </p>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>

                {/* Toolbar */}
                <div className="flex space-x-1 border-b p-1 bg-gray-50 mb-2">
                  <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">B</button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">I</button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">• List</button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">1. List</button>
                  <button type="button" onClick={() => {
                    const url = prompt('Enter link URL');
                    if (url) editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                  }} className="px-2 py-1 border rounded">Link</button>

                  {/* File upload */}
                  <input type="file" accept="image/*" id="image-upload" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  <label htmlFor="image-upload" className="px-2 py-1 border rounded cursor-pointer">Image</label>
                </div>

                <EditorContent editor={editor} className="border rounded p-3 min-h-[300px]" />
              </div>

              {/* SEO Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Title</label>
                  <input type="text" value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                  <input type="text" value={formData.featuredImage} onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} className="w-full border rounded px-3 py-2" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                <input type="text" value={formData.metaKeywords} onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="keyword1, keyword2, ..." />
              </div>

              {/* Author & Publish */}
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="mr-2" />
                <label className="text-sm font-medium">Publish</label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
                  {loading ? 'Saving...' : editingPage ? 'Update' : 'Create'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
