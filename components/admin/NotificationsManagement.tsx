'use client';

import { useState } from 'react';
import { FaBell, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import NotificationModal from './NotificationModal';

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

interface NotificationsManagementProps {
  initialNotifications: Notification[];
}

const NotificationsManagement = ({ initialNotifications }: NotificationsManagementProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleAddNew = () => {
    setSelectedNotification(null);
    setIsModalOpen(true);
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleDelete = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(notifications.filter(n => n._id !== notificationId));
        toast.success('Notification deleted successfully');
      } else {
        toast.error('Failed to delete notification');
      }
    } catch {
      toast.error('Error deleting notification');
    }
  };

  const handleToggleActive = async (notification: Notification) => {
    try {
      const response = await fetch(`/api/notifications/${notification._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notification, active: !notification.active }),
      });

      if (response.ok) {
        const updatedNotification = await response.json();
        setNotifications(notifications.map(n => 
          n._id === updatedNotification._id ? updatedNotification : n
        ));
        toast.success(`Notification ${updatedNotification.active ? 'activated' : 'deactivated'}`);
      } else {
        toast.error('Failed to update notification');
      }
    } catch {
      toast.error('Error updating notification');
    }
  };

  const handleSave = (savedNotification: Notification) => {
    if (selectedNotification) {
      setNotifications(notifications.map(n => 
        n._id === savedNotification._id ? savedNotification : n
      ));
    } else {
      setNotifications([savedNotification, ...notifications]);
    }
    setIsModalOpen(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'promotion':
        return 'bg-purple-100 text-purple-800';
      case 'announcement':
        return 'bg-blue-100 text-blue-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeNotifications = notifications.filter(n => n.active);
  const inactiveNotifications = notifications.filter(n => !n.active);

  return (
    <>
      {/* Stats and Action */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{activeNotifications.length}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-600">{inactiveNotifications.length}</div>
              <div className="text-sm text-gray-600">Inactive</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold">
                {notifications.filter(n => n.type === 'offer').length}
              </div>
              <div className="text-sm text-gray-600">Offers</div>
            </div>
          </div>

          <button onClick={handleAddNew} className="btn-primary flex items-center space-x-2">
            <FaPlus />
            <span>Add Notification</span>
          </button>
        </div>
      </div>

      {/* Active Notifications */}
      {activeNotifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Active Notifications</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeNotifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-white rounded-xl shadow-lg p-6 hover-lift"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`badge ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className="badge bg-green-100 text-green-800">Active</span>
                      <span className="text-sm text-gray-600">
                        Priority: {notification.priority}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                  </div>
                </div>

                {/* Display Locations */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Display on:</div>
                  <div className="flex flex-wrap gap-2">
                    {notification.displayLocation.map((location: string, idx: number) => (
                      <span key={idx} className="badge badge-gold text-xs">
                        {location}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div 
                  className="mb-4 p-4 rounded-lg"
                  style={{
                    backgroundColor: notification.backgroundColor || '#D4AF37',
                    color: notification.textColor || '#FFFFFF',
                  }}
                >
                  <div className="font-semibold mb-1">{notification.title}</div>
                  <div className="text-sm">{notification.message}</div>
                  {notification.buttonText && notification.link && (
                    <button className="mt-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-semibold">
                      {notification.buttonText}
                    </button>
                  )}
                </div>

                {/* Dates */}
                <div className="mb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Start: {formatDate(notification.startDate)}</span>
                    {notification.endDate && (
                      <span>End: {formatDate(notification.endDate)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleToggleActive(notification)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaToggleOff />
                    <span>Deactivate</span>
                  </button>
                  <button
                    onClick={() => handleEdit(notification)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Notifications */}
      {inactiveNotifications.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Inactive Notifications</h2>
          <div className="space-y-4">
            {inactiveNotifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-white rounded-xl shadow-lg p-6 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`badge ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className="badge bg-gray-200 text-gray-600">Inactive</span>
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600">{notification.message}</p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(notification)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <FaToggleOn />
                      <span>Activate</span>
                    </button>
                    <button
                      onClick={() => handleEdit(notification)}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">No notifications created yet.</p>
          <button onClick={handleAddNew} className="btn-primary">
            Create Your First Notification
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default NotificationsManagement;