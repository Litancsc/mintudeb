import Link from 'next/link';
import CarCard from '@/components/cars/CarCard';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';

async function getFeaturedCars() {
  try {
    await dbConnect();
    const cars = await Car.find({ available: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    
    return JSON.parse(JSON.stringify(cars));
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    return [];
  }
}

const FeaturedCars = async () => {
  const cars = await getFeaturedCars();

  return (
    <section id="featured-cars" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Featured Cars</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of premium vehicles available for rent.
          </p>
        </div>

        {cars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car: any) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/cars" className="btn-primary">
                View All Cars
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No cars available at the moment. Please check back later.
            </p>
            <Link href="/admin/login" className="btn-primary">
              Add Cars (Admin)
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;
