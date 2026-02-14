'use client';

import { useState } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Executive',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=D4AF37&color=fff&size=128',
      rating: 5,
      text: 'Exceptional service! The car was in perfect condition and the booking process was seamless. Highly recommend DriveNow Rentals for anyone looking for quality and reliability.',
    },
    {
      name: 'Michael Chen',
      role: 'Travel Blogger',
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=D4AF37&color=fff&size=128',
      rating: 5,
      text: 'I\'ve rented from many companies, but DriveNow stands out. Great selection of cars, competitive prices, and outstanding customer support. Will definitely use them again!',
    },
    {
      name: 'Emma Williams',
      role: 'Photographer',
      image: 'https://ui-avatars.com/api/?name=Emma+Williams&background=D4AF37&color=fff&size=128',
      rating: 5,
      text: 'Perfect experience from start to finish. The luxury SUV I rented was immaculate and made my road trip unforgettable. The staff was friendly and professional.',
    },
    {
      name: 'David Rodriguez',
      role: 'Entrepreneur',
      image: 'https://ui-avatars.com/api/?name=David+Rodriguez&background=D4AF37&color=fff&size=128',
      rating: 5,
      text: 'Best car rental service I\'ve used. The online booking was quick, pickup was smooth, and the car exceeded my expectations. Five stars all the way!',
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what our satisfied customers have to say about their experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative">
            {/* Quote Icon */}
            <FaQuoteLeft className="text-6xl text-gold opacity-20 absolute top-8 left-8" />

            {/* Testimonial Content */}
            <div className="relative z-10">
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

              <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center md:text-left">
                "{current.text}"
              </p>

              {/* Navigation */}
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gold hover:text-white transition-all"
                  aria-label="Previous testimonial"
                >
                  <FaChevronLeft />
                </button>

                {/* Dots */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-gold w-8'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gold hover:text-white transition-all"
                  aria-label="Next testimonial"
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
