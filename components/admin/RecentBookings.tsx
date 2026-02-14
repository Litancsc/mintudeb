import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface RecentBookingsProps {
  bookings: any[];
}

const RecentBookings = ({ bookings }: RecentBookingsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Recent Bookings</h2>
        <p className="text-gray-600 text-center py-8">No bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-primary">Recent Bookings</h2>
          <p className="text-sm text-gray-500 mt-1">Latest activity from your customers</p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center px-4 py-2 bg-gold hover:bg-gold/90 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
        >
          View All
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Car
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Pickup Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Total Price
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr 
                key={booking._id} 
                className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-primary">
                      {booking.customerName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium">{booking.carId?.name || 'N/A'}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-700">{formatDate(booking.pickupDate)}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-gold">{formatCurrency(booking.totalPrice)}</div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;
