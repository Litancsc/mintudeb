import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/admin/AdminLayout';
import BookingsManagement from '@/components/admin/BookingsManagement';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Car from '@/models/Car';

async function getBookings() {
  try {
    await dbConnect();
    const bookings = await Booking.find()
      .populate('carId')
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login');
  }

  const bookings = await getBookings();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Bookings Management
        </h1>
        <p className="text-gray-600">
          View and manage all customer bookings and reservations.
        </p>
      </div>

      <BookingsManagement initialBookings={bookings} />
    </>
  );
}
