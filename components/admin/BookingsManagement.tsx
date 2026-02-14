'use client';

import { useState } from 'react';
import { FaCalendarCheck, FaSearch, FaEye, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId?: {
    name?: string;
  };
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime?: string;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingsManagementProps {
  initialBookings: Booking[];
}

const BookingsManagement = ({ initialBookings }: BookingsManagementProps) => {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(bookings.map(b => b._id === updatedBooking._id ? updatedBooking : b));
        toast.success(`Booking ${status}`);
      } else {
        toast.error('Failed to update booking');
      }
    } catch {
      toast.error('Error updating booking');
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(bookings.filter(b => b._id !== bookingId));
        toast.success('Booking deleted successfully');
      } else {
        // Improved error handling for non-JSON error responses
        let errorBody: { error?: string; message?: string } = {};
        let errorText = '';
        try {
          errorBody = await response.json();
        } catch {
          try {
            errorText = await response.text();
            errorBody = errorText ? { message: errorText } : {};
          } catch {
            errorBody = {};
          }
        }
        // If errorBody is an object with an 'error' property, use it; otherwise, use errorText or statusText
        const idSuffix = bookingId.slice(-8);
        const errorMsg =
          typeof errorBody === 'object' && errorBody.error
            ? errorBody.error
            : errorBody && typeof errorBody === 'object' && errorBody.message
            ? errorBody.message
            : errorText || response.statusText || 'Unknown error';

        // Log the error for debugging
        console.error('Failed to delete booking:', {
          status: response.status,
          statusText: response.statusText,
          errorBody,
        });

        toast.error(
          `Failed to delete booking${response.status ? ` [${response.status}]` : ''}${errorMsg === 'Invalid booking ID' ? ` (${idSuffix})` : ''}: ${errorMsg}`
        );
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      toast.error('Error deleting booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      case 'completed':
        return 'badge bg-gray-200 text-gray-800';
      default:
        return 'badge';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name, email, or car..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-full md:w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FaCalendarCheck className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {searchTerm || filterStatus !== 'all'
              ? 'No bookings found matching your criteria.'
              : 'No bookings yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Booking ID
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Car
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Pickup
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Return
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Duration
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      {/* Only display the last 8 chars for UI, always use full _id for API calls */}
                      <span className="text-xs font-mono text-gray-600">
                        {booking._id.slice(-8)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-primary">
                          {booking.customerName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.customerEmail}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-primary">
                        {booking.carId?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.pickupLocation}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div>{formatDate(booking.pickupDate)}</div>
                        <div className="text-gray-600">{booking.pickupTime}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div>{formatDate(booking.returnDate)}</div>
                        {booking.returnTime && (
                          <div className="text-gray-600">{booking.returnTime}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold">
                        {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gold">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Confirm"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'completed')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-gold hover:bg-gold-light rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          // Always use the full booking._id for API calls
                          onClick={() => handleDelete(booking._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-medium">{selectedBooking.customerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{selectedBooking.customerEmail}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{selectedBooking.customerPhone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <span className={`badge ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Car</div>
                    <div className="font-medium">{selectedBooking.carId?.name || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Pickup Location</div>
                    <div className="font-medium">{selectedBooking.pickupLocation}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Pickup Date</div>
                    <div className="font-medium">{formatDate(selectedBooking.pickupDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Pickup Time</div>
                    <div className="font-medium">{selectedBooking.pickupTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Return Date</div>
                    <div className="font-medium">{formatDate(selectedBooking.returnDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Return Time</div>
                    <div className="font-medium">{selectedBooking.returnTime || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium">
                      {selectedBooking.totalDays} {selectedBooking.totalDays === 1 ? 'day' : 'days'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Price</div>
                    <div className="font-bold text-gold text-xl">
                      {formatCurrency(selectedBooking.totalPrice)}
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.message && (
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-3">Customer Message</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedBooking.message}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Timestamps</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Created</div>
                    <div className="font-medium">{formatDate(selectedBooking.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Last Updated</div>
                    <div className="font-medium">{formatDate(selectedBooking.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingsManagement;
