'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaCar, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import CarModal from './CarModal';
import Image from 'next/image';

interface Car {
  _id?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  seats: number;
  transmission: string;
  fuelType: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  mainImage: string;
  images: string[];
  description: string;
  features: string[];
  available: boolean;
  mileage: string;
  color: string;
  licensePlate: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  slug?: string;
}

interface CarsManagementProps {
  initialCars: Car[];
}

const CarsManagement = ({ initialCars }: CarsManagementProps) => {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');

  const handleAddNew = () => {
    setSelectedCar(null);
    setIsModalOpen(true);
  };

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleDelete = async (carId: string | undefined) => {
    if (!carId) {
      toast.error('Invalid car ID');
      return;
    }

    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCars(cars.filter(c => c._id !== carId));
        toast.success('Car deleted successfully');
      } else {
        toast.error('Failed to delete car');
      }
    } catch {
      toast.error('Error deleting car');
    }
  };

  const handleToggleAvailability = async (car: Car) => {
    if (!car._id) {
      toast.error('Invalid car ID');
      return;
    }

    try {
      const response = await fetch(`/api/cars/${car._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...car, available: !car.available }),
      });

      if (response.ok) {
        const updatedCar = await response.json();
        setCars(cars.map(c => c._id === updatedCar._id ? updatedCar : c));
        toast.success(`Car ${updatedCar.available ? 'marked as available' : 'marked as unavailable'}`);
      } else {
        toast.error('Failed to update availability');
      }
    } catch {
      toast.error('Error updating availability');
    }
  };

  const handleSave = (savedCar: Car) => {
    if (selectedCar) {
      setCars(cars.map(c => c._id === savedCar._id ? savedCar : c));
    } else {
      setCars([savedCar, ...cars]);
    }
    setIsModalOpen(false);
  };

  const carTypes = ['Economy', 'Luxury', 'SUV', 'Sports', 'Van', 'Electric'];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || car.type === filterType;
    const matchesAvailability = filterAvailability === 'all' || 
                               (filterAvailability === 'available' && car.available) ||
                               (filterAvailability === 'unavailable' && !car.available);
    return matchesSearch && matchesType && matchesAvailability;
  });

  return (
    <>
      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cars by name, brand, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              {carTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <button onClick={handleAddNew} className="btn-primary flex items-center space-x-2">
              <FaPlus />
              <span>Add New Car</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{cars.length}</div>
            <div className="text-sm text-gray-600">Total Cars</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {cars.filter(c => c.available).length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {cars.filter(c => !c.available).length}
            </div>
            <div className="text-sm text-gray-600">Unavailable</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">
              {filteredCars.length}
            </div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">
            {searchTerm || filterType !== 'all' || filterAvailability !== 'all'
              ? 'No cars found matching your criteria.'
              : 'No cars added yet.'}
          </p>
          <button onClick={handleAddNew} className="btn-primary">
            Add Your First Car
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div
              key={car._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
            >
              {/* Car Image */}
              <div className="relative h-48">
                <Image
                  src={car.mainImage}
                  alt={car.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="badge badge-gold">{car.type}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => handleToggleAvailability(car)}
                    className={`p-2 rounded-full ${
                      car.available
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                    } transition-colors`}
                    title={car.available ? 'Available' : 'Unavailable'}
                  >
                    {car.available ? (
                      <FaToggleOn className="text-white text-xl" />
                    ) : (
                      <FaToggleOff className="text-white text-xl" />
                    )}
                  </button>
                </div>
              </div>

              {/* Car Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-1">
                  {car.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {car.brand} {car.model} - {car.year}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-semibold">{car.seats}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Trans:</span>
                    <span className="font-semibold">{car.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Fuel:</span>
                    <span className="font-semibold">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`badge ${
                        car.available ? 'badge-success' : 'badge-danger'
                      } text-xs`}
                    >
                      {car.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Per Day:</span>
                    <span className="text-xl font-bold text-gold">
                      {formatCurrency(car.pricePerDay)}
                    </span>
                  </div>
                  {car.pricePerWeek && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Per Week:</span>
                      <span className="font-semibold">
                        {formatCurrency(car.pricePerWeek)}
                      </span>
                    </div>
                  )}
                  {car.pricePerMonth && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Per Month:</span>
                      <span className="font-semibold">
                        {formatCurrency(car.pricePerMonth)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features Preview */}
                {car.features && car.features.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {car.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="badge badge-gold text-xs">
                          {feature}
                        </span>
                      ))}
                      {car.features.length > 3 && (
                        <span className="badge bg-gray-200 text-gray-600 text-xs">
                          +{car.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* SEO Status */}
                <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">SEO:</span>
                    <span className={`badge ${car.metaTitle ? 'badge-success' : 'badge-warning'} text-xs`}>
                      {car.metaTitle ? 'Optimized' : 'Needs Attention'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={car.slug ? `/cars/${car.slug}` : '/cars'}
                    target="_blank"
                    className="flex-1 btn-outline text-center flex items-center justify-center space-x-1"
                  >
                    <FaEye />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => handleEdit(car)}
                    className="flex-1 bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center justify-center space-x-1"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <CarModal
          car={selectedCar}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default CarsManagement;
