import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CarGrid from '@/components/cars/CarGrid';
import CarFilters from '@/components/cars/CarFilters';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Browse Premium Cars for Rent | Rupali Travel Agency in Shillong',
  description: 'Explore our extensive fleet of rental cars. Economy, luxury, SUVs, sports cars, and more. Find the perfect vehicle for your needs at competitive prices.',
  keywords: ['car rental fleet', 'rent cars online', 'luxury car hire', 'economy car rental', 'SUV rental'],
});

export default function CarsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light text-white py-16">
          <div className="container-custom">
            <h1 className="heading-lg mb-4">Our Fleet</h1>
            <p className="text-xl text-gray-200">
              Browse our wide selection of premium vehicles available for rent
            </p>
          </div>
        </section>

        {/* Filters and Cars */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:col-span-1">
                <Suspense fallback={<div>Loading filters...</div>}>
                  <CarFilters />
                </Suspense>
              </aside>

              {/* Car Grid */}
              <div className="lg:col-span-3">
                <Suspense fallback={<div className="text-center py-12">Loading cars...</div>}>
                  <CarGrid />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
