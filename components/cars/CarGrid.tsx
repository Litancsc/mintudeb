import { Suspense } from 'react';
import CarCard from './CarCard';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';

async function getCars(searchParams: any) {
  try {
    await dbConnect();
    
    const query: any = { available: true };
    
    // Apply filters
    if (searchParams.type) {
      query.type = searchParams.type;
    }
    if (searchParams.transmission) {
      query.transmission = searchParams.transmission;
    }
    if (searchParams.fuelType) {
      query.fuelType = searchParams.fuelType;
    }
    if (searchParams.minPrice || searchParams.maxPrice) {
      query.pricePerDay = {};
      if (searchParams.minPrice) {
        query.pricePerDay.$gte = Number(searchParams.minPrice);
      }
      if (searchParams.maxPrice) {
        query.pricePerDay.$lte = Number(searchParams.maxPrice);
      }
    }
    if (searchParams.seats) {
      const seatValue = searchParams.seats.replace('+', '');
      if (searchParams.seats.includes('+')) {
        query.seats = { $gte: Number(seatValue) };
      } else {
        query.seats = Number(seatValue);
      }
    }

    const cars = await Car.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(cars));
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

const CarGrid = async ({ searchParams }: { searchParams?: any }) => {
  const cars = await getCars(searchParams || {});

  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 mb-4">
          No cars found matching your criteria.
        </p>
        <p className="text-gray-500">
          Try adjusting your filters or browse all available cars.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <strong>{cars.length}</strong> car{cars.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car: any) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </>
  );
};

export default CarGrid;
