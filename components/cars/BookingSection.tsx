'use client';

import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Car {
  _id: string;
  name: string;
}

const BookingSection = ({ car }: { car: Car }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    pickupTime: '10:00',
    message: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     WhatsApp Redirect
  ========================== */
  const redirectToWhatsApp = (bookingId: string) => {
    const phone = '918415038275';

    const text = `
New Booking Request 🚗

Car: ${car.name}
Name: ${formData.customerName}
Phone: ${formData.customerPhone}
Pickup Date: ${formData.pickupDate}
Return Date: ${formData.returnDate}
Pickup Location: ${formData.pickupLocation}

Booking ID: ${bookingId}
`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  /* =========================
     Submit Booking
  ========================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          carId: car._id,
        }),
      });

      if (response.ok) {
        const booking = await response.json();

        toast.success('Booking submitted! Redirecting to WhatsApp…');

        redirectToWhatsApp(booking._id);

        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          pickupDate: '',
          returnDate: '',
          pickupLocation: '',
          pickupTime: '10:00',
          message: '',
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit booking');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gold-light to-gold p-8 rounded-2xl shadow-2xl">
      <h3 className="text-2xl font-bold text-primary mb-6">
        Book This Car
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Full Name"
        />

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Email"
          />
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Phone"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">
            <FaMapMarkerAlt className="inline mr-2" />
            Pickup Location
          </label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              <FaCalendarAlt className="inline mr-2" />
              Pickup Date
            </label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              min={today}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <FaClock className="inline mr-2" />
              Pickup Time
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
        </div>

        {/* Return Date */}
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          min={formData.pickupDate || today}
          required
          className="input-field"
        />

        {/* Message */}
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          className="input-field"
          placeholder="Optional message"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Submitting…' : 'Submit Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingSection;
