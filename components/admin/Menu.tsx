'use client';

import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { FaPlus, FaEdit, FaTrash,  } from 'react-icons/fa';

interface MenuItem {
  _id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  location: string;
  openInNewTab: boolean;
  parentId?: string | null;
  children?: MenuItem[];
}

export default function MenuManagement() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    order: 0,
    isActive: true,
    location: 'both',
    openInNewTab: false,
    parentId: '',
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch('/api/menus');
      if (res.ok) {
        const data = await res.json();
        setMenus(data);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Defensive: prevent duplicate href for top-level menus
    if (!editingMenu && !formData.parentId) {
      const duplicate = menus.find(
        m => m.href === formData.href && (!m.parentId || m.parentId === '')
      );
      if (duplicate) {
        alert('A top-level menu with this link already exists.');
        return;
      }
    }

    try {
      const url = editingMenu ? `/api/menus/${editingMenu._id}` : '/api/menus';
      const method = editingMenu ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingMenu(null);
        resetForm();
        fetchMenus();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save menu');
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Failed to save menu');
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const res = await fetch(`/api/menus/${_id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMenus();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete menu');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      alert('Failed to delete menu');
    }
  };

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setFormData({
      label: menu.label,
      href: menu.href,
      order: menu.order,
      isActive: menu.isActive,
      location: menu.location,
      openInNewTab: menu.openInNewTab,
      parentId: menu.parentId || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      label: '',
      href: '',
      order: 0,
      isActive: true,
      location: 'both',
      openInNewTab: false,
      parentId: '',
    });
  };

  const renderMenuItem = (item: MenuItem, level = 0) => (
    <div key={item._id}>
      <div
        className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-2 ${
          level > 0 ? 'ml-8' : ''
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">{item.label}</h3>
            {!item.isActive && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">
                Inactive
              </span>
            )}
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
              {item.location}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{item.href}</p>
          <p className="text-xs text-gray-500 mt-1">Order: {item.order}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      {item.children && item.children.map(child => renderMenuItem(child, level + 1))}
    </div>
  );

  // Flatten menus for parent selection
  const flattenMenus = (items: MenuItem[], parent = ''): { id: string; label: string }[] => {
    return items.reduce((acc: { id: string; label: string }[], item) => {
      const prefix = parent ? `${parent} > ` : '';
      acc.push({ id: item._id, label: `${prefix}${item.label}` });
      if (item.children) {
        acc.push(...flattenMenus(item.children, `${prefix}${item.label}`));
      }
      return acc;
    }, []);
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
          <h1 className="text-3xl font-bold text-primary">Menu Management</h1>
          <button
            onClick={() => {
              setEditingMenu(null);
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <FaPlus /> Add Menu Item
          </button>
        </div>

        <div className="space-y-2">
          {menus.map(menu => renderMenuItem(menu))}
          {menus.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No menu items found. Create your first menu item!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingMenu ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link (href)</label>
                <input
                  type="text"
                  value={formData.href}
                  onChange={e => setFormData({ ...formData, href: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  placeholder="/about, /cars, https://example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <select
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  >
                    <option value="both">Both (Header & Footer)</option>
                    <option value="header">Header Only</option>
                    <option value="footer">Footer Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Parent Menu (Optional)</label>
                <select
                  value={formData.parentId}
                  onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                >
                  <option value="">No Parent (Top Level)</option>
                  {flattenMenus(menus)
                    .filter(m => !editingMenu || m.id !== editingMenu._id)
                    .map(m => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.openInNewTab}
                    onChange={e => setFormData({ ...formData, openInNewTab: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Open in New Tab</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gold text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {editingMenu ? 'Update' : 'Create'} Menu Item
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingMenu(null);
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