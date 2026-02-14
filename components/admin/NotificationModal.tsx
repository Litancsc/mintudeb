'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  displayLocation: string[];
  active: boolean;
  startDate: string;
  endDate?: string;
  link?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  priority: number;
}

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
  onSave: (notification: Notification) => void;
}

const NotificationModal = ({ notification, onClose, onSave }: NotificationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    displayLocation: [] as string[],
    active: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    link: '',
    buttonText: '',
    backgroundColor: '#D4AF37',
    textColor: '#FFFFFF',
    priority: 5,
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title || '',
        message: notification.message || '',
        type: notification.type || 'announcement',
        displayLocation: notification.displayLocation || [],
        active: notification.active ?? true,
        startDate: notification.startDate ? new Date(notification.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: notification.endDate ? new Date(notification.endDate).toISOString().split('T')[0] : '',
        link: notification.link || '',
        buttonText: notification.buttonText || '',
        backgroundColor: notification.backgroundColor || '#D4AF37',
        textColor: notification.textColor || '#FFFFFF',
        priority: notification.priority || 5,
      });
    }
  }, [notification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDisplayLocationChange = (location: string) => {
    const updatedLocations = formData.displayLocation.includes(location)
      ? formData.displayLocation.filter(l => l !== location)
      : [...formData.displayLocation, location];
    
    setFormData({ ...formData, displayLocation: updatedLocations });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.message || formData.displayLocation.length === 0) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const url = notification ? `/api/notifications/${notification._id}` : '/api/notifications';
      const method = notification ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedNotification = await response.json();
        toast.success(notification ? 'Notification updated successfully' : 'Notification created successfully');
        onSave(savedNotification);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save notification');
      }
    } catch {
      toast.error('Error saving notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const notificationTypes = ['offer', 'promotion', 'announcement', 'alert'];
  const displayLocations = ['homepage', 'banner', 'popup'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">
            {notification ? 'Edit Notification' : 'Add New Notification'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., 🎉 Summer Special Offer!"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Get 20% off on all bookings this summer!"
                    rows={3}
                    className="input-field resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      {notificationTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (0-10) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Display Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display On <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {displayLocations.map(location => (
                      <label key={location} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.displayLocation.includes(location)}
                          onChange={() => handleDisplayLocationChange(location)}
                          className="w-5 h-5 text-gold focus:ring-gold border-gray-300 rounded"
                        />
                        <span className="text-sm">
                          {location.charAt(0).toUpperCase() + location.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="backgroundColor"
                        value={formData.backgroundColor}
                        onChange={handleChange}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        name="backgroundColor"
                        value={formData.backgroundColor}
                        onChange={handleChange}
                        className="input-field flex-1"
                        placeholder="#D4AF37"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="textColor"
                        value={formData.textColor}
                        onChange={handleChange}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        name="textColor"
                        value={formData.textColor}
                        onChange={handleChange}
                        className="input-field flex-1"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Settings */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Call-to-Action (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    placeholder="e.g., Book Now"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Link
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://example.com/offer"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Date Settings */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Schedule</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Preview</h3>
              <div 
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: formData.backgroundColor,
                  color: formData.textColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-2">{formData.title || 'Notification Title'}</div>
                    <div className="mb-4">{formData.message || 'Notification message will appear here...'}</div>
                    {formData.buttonText && formData.link && (
                      <button 
                        className="px-6 py-2 bg-white bg-opacity-20 rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
                        type="button"
                      >
                        {formData.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-5 h-5 text-gold focus:ring-gold border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mark as active (visible to users)
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner mr-2" />
                  Saving...
                </>
              ) : (
                notification ? 'Update Notification' : 'Create Notification'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;