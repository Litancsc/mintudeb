import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/admin/AdminLayout';
import CarsManagement from '@/components/admin/CarsManagementList';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';

async function getCars() {
  try {
    await dbConnect();
    const cars = await Car.find()
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(cars));
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export default async function CarsManagementPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login');
  }

  const cars = await getCars();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Car Management
        </h1>
        <p className="text-gray-600">
          Manage your car inventory with pricing, features, and SEO optimization.
        </p>
      </div>

      <CarsManagement initialCars={cars} />
    </>
  );
}
