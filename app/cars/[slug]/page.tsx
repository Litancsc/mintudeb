import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateMetadata as genMeta, generateCarSchema } from '@/lib/seo';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import {
  FaUsers,
  FaCog,
  FaGasPump,
  FaCheckCircle,
  FaCalendarAlt,
  FaArrowLeft,
  FaWhatsapp,
  FaPhone,
} from 'react-icons/fa';
import BookingSection from '@/components/cars/BookingSection';

/* ---------------- TYPES ---------------- */

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type SimilarCar = {
  _id: string;
  name: string;
  slug: string;
  type: string;
  mainImage: string;
  pricePerDay: number;
};

/* ---------------- DATA ---------------- */

async function getCar(slug: string) {
  try {
    await dbConnect();
    const car = await Car.findOne({ slug }).lean();
    return car ? JSON.parse(JSON.stringify(car)) : null;
  } catch (_error) {
    return null;
  }
}

async function getSimilarCars(currentCarId: string, type: string) {
  try {
    await dbConnect();
    const cars = await Car.find({
      _id: { $ne: currentCarId },
      type,
      available: true,
    })
      .limit(3)
      .lean();

    return JSON.parse(JSON.stringify(cars)) as SimilarCar[];
  } catch (_error) {
    return [];
  }
}

/* ---------------- SEO ---------------- */

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params; // ✅ unwrap the Promise
  const car = await getCar(slug);

  if (!car) {
    return genMeta({
      title: 'Car Not Found',
      description: 'The car you are looking for could not be found.',
    });
  }

  return genMeta({
    title: car.metaTitle || `${car.name} - Rent for $${car.pricePerDay}/day`,
    description: car.metaDescription || car.description,
    keywords: car.metaKeywords,
    ogImage: car.mainImage,
  });
}

/* ---------------- PAGE ---------------- */

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params; // ✅ unwrap the Promise
  const car = await getCar(slug);

  if (!car) {
    notFound();
  }

  const similarCars = await getSimilarCars(car._id, car.type);
  const carSchema = generateCarSchema(car);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Back Button */}
        <div className="bg-gray-50 py-4">
          <div className="container-custom">
            <Link
              href="/cars"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gold transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Cars</span>
            </Link>
          </div>
        </div>

        {/* Car Details */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Images */}
              <div>
                <div className="relative h-96 rounded-2xl overflow-hidden mb-4 shadow-2xl">
                  <Image
                    src={car.mainImage}
                    alt={car.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {!car.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold text-lg">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-gold text-lg">{car.type}</span>
                  </div>
                </div>

                {/* Additional Images */}
                {car.images && car.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {car.images.slice(0, 4).map((image: string, index: number) => (
                      <div
                        key={index}
                        className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                      >
                        <Image
                          src={image}
                          alt={`${car.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-primary mb-2">
                    {car.name}
                  </h1>
                  <p className="text-xl text-gray-600">
                    {car.year} {car.brand} {car.carModel}
                  </p>
                </div>

                {/* Price / Contact */}
                <div className="bg-gold-light p-6 rounded-xl mb-6">
                  <div className="flex items-center space-x-4">
                    <a
                      href={`https://api.whatsapp.com/send?phone=7085901345&text=${encodeURIComponent(
                        `Hi, I'm interested in renting the ${car.name} for a day. Is it available?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
                    >
                      <FaWhatsapp size={20} />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href="tel:+917085901345"
                      className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-full transition"
                    >
                      <FaPhone size={18} />
                      <span>7085901345</span>
                    </a>
                  </div>
                </div>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaUsers className="text-gold text-xl" />
                      <span className="text-gray-600">Seats</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {car.seats}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaCog className="text-gold text-xl" />
                      <span className="text-gray-600">Transmission</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {car.transmission}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaGasPump className="text-gold text-xl" />
                      <span className="text-gray-600">Fuel Type</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {car.fuelType}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaCalendarAlt className="text-gold text-xl" />
                      <span className="text-gray-600">Year</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {car.year}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {(car.color || car.mileage) && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {car.color && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Color</div>
                        <div className="font-semibold text-primary">
                          {car.color}
                        </div>
                      </div>
                    )}
                    {car.mileage && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Mileage
                        </div>
                        <div className="font-semibold text-primary">
                          {car.mileage}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Features */}
                {car.features && car.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-primary mb-3">
                      Features
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {car.features.map(
                        (feature: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <FaCheckCircle className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Booking */}
                {car.available && (
                  <div className="mt-6">
                    <BookingSection car={car} />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-12 pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-primary mb-4">
                About This Car
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {car.description}
              </p>
            </div>
          </div>
        </section>

        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <section className="section-padding bg-gray-50">
            <div className="container-custom">
              <h2 className="text-2xl font-bold text-primary mb-8">
                Similar Cars You Might Like
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {similarCars.map((similarCar) => (
                  <Link
                    key={similarCar._id}
                    href={`/cars/${similarCar.slug}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
                  >
                    <div className="relative h-48">
                      <Image
                        src={similarCar.mainImage}
                        alt={similarCar.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-primary mb-2">
                        {similarCar.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">
                          {similarCar.type}
                        </span>
                        <span className="text-xl font-bold text-gold">
                          
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
