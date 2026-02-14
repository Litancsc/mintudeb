import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentBookings from '@/components/admin/RecentBookings';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import Booking from '@/models/Booking';
import BlogPost from '@/models/BlogPost';

async function getDashboardData() {
  try {
    await dbConnect();
    
    const [
      totalCars,
      availableCars,
      totalBookings,
      pendingBookings,
      totalPosts,
      publishedPosts,
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ available: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ published: true }),
    ]);
    
    const recentBookings = await Booking.find()
      .populate('carId')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    return {
      stats: {
        totalCars,
        availableCars,
        totalBookings,
        pendingBookings,
        totalPosts,
        publishedPosts,
      },
      recentBookings: JSON.parse(JSON.stringify(recentBookings)),
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      stats: {
        totalCars: 0,
        availableCars: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalPosts: 0,
        publishedPosts: 0,
      },
      recentBookings: [],
    };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login');
  }

  const { stats, recentBookings } = await getDashboardData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your car rental business today.
        </p>
      </div>

      <DashboardStats stats={stats} />
      
      <div className="mt-8">
        <RecentBookings bookings={recentBookings} />
      </div>
    </div>
  );
}
