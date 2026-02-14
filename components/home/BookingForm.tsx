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
    
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Book Your Ride</h2>
       <a
      href={`https://api.whatsapp.com/send?phone=8415038275&text=${encodeURIComponent(
        `Hi, I'm interested in renting the  for day. Is it available?`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp size={20} />
      <span>WhatsApp</span>
    </a>
    
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaMapMarkerAlt className="inline mr-2 text-gold" />
            Pick-up Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Enter city or airport"
            value={formData.location}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2 text-gold" />
              Pick-up Date
            </label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              min={today}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2 text-gold" />
              Return Date
            </label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              min={formData.pickupDate || today}
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaClock className="inline mr-2 text-gold" />
            Pick-up Time
          </label>
          <select
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange}
            className="input-field"
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
        <button type="submit" className="btn-primary w-full">
          Search Available Cars
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          🎉 <strong>Special Offer:</strong> Get 20% off on bookings over 7 days!
        </p>
      </div>
    </div>
  );
};

export default BookingForm;
