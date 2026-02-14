import Link from 'next/link';
import Image from 'next/image';
import { FaUsers, FaCog, FaGasPump, FaStar } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';

interface CarCardProps {
  car: {
    _id: string;
    name: string;
    slug: string;
    brand: string;
    type: string;
    mainImage: string;
    pricePerDay: number;
    seats: number;
    transmission: string;
    fuelType: string;
    available: boolean;
  };
}


const CarCard = ({ car }: CarCardProps) => {
   const whatsappNumber = '8415038275';
  const whatsappMessage = `I want to book the ${car.name}`;
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift card-hover">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={car.mainImage}
          alt={car.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!car.available && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              Not Available
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="badge badge-gold">{car.type}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2 hover:text-gold transition-colors">
          <Link href={`/cars/${car.slug}`}>{car.name}</Link>
        </h3>
        <p className="text-gray-600 mb-4">{car.brand}</p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaUsers className="text-gold" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaCog className="text-gold" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaGasPump className="text-gold" />
            <span>{car.fuelType}</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className=" font-bold text-gold">
              <a
                href={whatsappLink}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center space-x-2 hover:bg-green-400 px-4 py-2 rounded-full transition"
             title="Chat on WhatsApp"
                >
            <FaWhatsapp size={35} />
           <span></span>
            </a>
            </span>
            </div>
          <Link
            href={`/cars/${car.slug}`}
            className="btn-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
