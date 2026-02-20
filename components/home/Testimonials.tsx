'use client';

import { useState } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft, FaGoogle } from 'react-icons/fa';

const GOOGLE_REVIEW_URL =
  'https://www.google.com/search?sca_esv=6da2c71a879288c4&rlz=1C1CHBF_enIN1139IN1139&cs=0&output=search&kgmid=/g/11l6ddhfms&q=Miles+For+Smiles+Tours+%26+Travels&shndl=30&source=sh/x/kp/local/m1/1&kgs=302b4011490c25f3&shem=shrtsdl&utm_source=shrtsdl,sh/x/kp/local/m1/1#lrd=0x37507f39f3e7baa5:0x7ae92a23ca682b56,1,,,,';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Executive',
      image:
        'https://ui-avatars.com/api/?name=Sarah+Johnson&background=D4AF37&color=fff&size=128',
      rating: 5,
      text: 'Exceptional service! Smooth booking and perfect car condition.',
    },
    {
      name: 'Michael Chen',
      role: 'Travel Blogger',
      image:
        'https://ui-avatars.com/api/?name=Michael+Chen&background=D4AF37&color=fff&size=128',
      rating: 5,
      text: 'Great selection, good prices, and amazing support team.',
    },
    {
      name: 'Emma Williams',
      role: 'Photographer',
      image:
        'https://ui-avatars.com/api/?name=Emma+Williams&background=D4AF37&color=fff&size=128',
      rating: 5,
      text: 'Luxury SUV was spotless. Wonderful road-trip experience!',
    },
  ];

  const nextTestimonial = () =>
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);

  const prevTestimonial = () =>
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[currentIndex];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from our happy travelers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative">
            <FaQuoteLeft className="text-6xl text-gold opacity-20 absolute top-8 left-8" />

            <div className="relative z-10">
              {/* User Info */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-24 h-24 rounded-full shadow-lg"
                />

                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-primary mb-1">
                    {current.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{current.role}</p>

                  <div className="flex justify-center md:justify-start space-x-1">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <FaStar key={i} className="text-gold" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Text */}
              <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center md:text-left">
                {current.text}
              </p>

              {/* Google Review Button */}
              <div className="flex justify-center mb-6">
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  <FaGoogle />
                  View All Reviews on Google
                </a>
              </div>

              {/* Navigation */}
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gold hover:text-white transition"
                >
                  <FaChevronLeft />
                </button>

                <button
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gold hover:text-white transition"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
