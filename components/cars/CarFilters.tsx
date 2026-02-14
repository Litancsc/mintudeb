'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';

const CarFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    seats: searchParams.get('seats') || '',
  });

  const carTypes = ['Economy', 'Luxury', 'SUV', 'Sports', 'Van', 'Electric'];
  const transmissionTypes = ['Automatic', 'Manual'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const seatOptions = ['2', '4', '5', '7', '9+'];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: typeof filters) => {
    const params = new URLSearchParams();
    
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    router.push(`/cars?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      transmission: '',
      fuelType: '',
      minPrice: '',
      maxPrice: '',
      seats: '',
    });
    router.push('/cars');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary flex items-center">
          <FaFilter className="mr-2 text-gold" />
          Filters
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-gold hover:text-gold-dark"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Car Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Car Type
          </label>
          <div className="space-y-2">
            {carTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={filters.type === type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="mr-2 text-gold focus:ring-gold"
                />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div className="border-t pt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Transmission
          </label>
          <div className="space-y-2">
            {transmissionTypes.map((trans) => (
              <label key={trans} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="transmission"
                  value={trans}
                  checked={filters.transmission === trans}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className="mr-2 text-gold focus:ring-gold"
                />
                <span className="text-gray-700">{trans}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fuel Type */}
        <div className="border-t pt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Fuel Type
          </label>
          <div className="space-y-2">
            {fuelTypes.map((fuel) => (
              <label key={fuel} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="fuelType"
                  value={fuel}
                  checked={filters.fuelType === fuel}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="mr-2 text-gold focus:ring-gold"
                />
                <span className="text-gray-700">{fuel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="border-t pt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Price Range (per day)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="input-field text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* Seats */}
        <div className="border-t pt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Number of Seats
          </label>
          <div className="flex flex-wrap gap-2">
            {seatOptions.map((seat) => (
              <button
                key={seat}
                onClick={() => handleFilterChange('seats', seat)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  filters.seats === seat
                    ? 'bg-gold text-white border-gold'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gold'
                }`}
              >
                {seat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFilters;
