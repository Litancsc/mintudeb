'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock ,FaWhatsapp, } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BookingForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
    pickupTime: '10:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location || !formData.pickupDate || !formData.returnDate) {
      toast.error('Please fill in all fields');
      return;
    }

    // Redirect to cars page with query params
    const params = new URLSearchParams({
      location: formData.location,
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      pickupTime: formData.pickupTime,
    });
    
    router.push(`/cars?${params.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
    
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Book Your Ride
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Find the perfect car for your journey
          </p>
        </div>

        <a
          href={`https://api.whatsapp.com/send?phone=8415038275&text=${encodeURIComponent(
            `Hi, I'm interested in renting a car. Is it available?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp size={20} />
        </a>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
      
        {/* Location */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <FaMapMarkerAlt className="mr-2 text-yellow-500" />
            Pick-up Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Enter city or airport"
            value={formData.location}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaCalendarAlt className="mr-2 text-yellow-500" />
              Pick-up Date
            </label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              min={today}
              className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaCalendarAlt className="mr-2 text-yellow-500" />
              Return Date
            </label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              min={formData.pickupDate || today}
              className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
              required
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <FaClock className="mr-2 text-yellow-500" />
            Pick-up Time
          </label>
          <select
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition bg-white"
          >
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, '0');
              return (
                <option key={hour} value={`${hour}:00`}>
                  {hour}:00
                </option>
              );
            })}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-14 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg shadow-xl transition transform hover:scale-[1.02]"
        >
          Search Available Cars
        </button>
      </form>

      {/* Offer Banner */}
      
    </div>
  );
};

export default BookingForm;
