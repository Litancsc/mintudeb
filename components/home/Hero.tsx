'use client';

import { useState } from 'react';
import BookingForm from './BookingForm';
import { FaPlay } from 'react-icons/fa';

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-24">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl animate-pulse" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE */}
        <div className="text-white">

          {/* Badge */}
          <div className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <span className="text-yellow-400 text-sm font-medium">
              Premium North East Experience
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Discover the Beauty of North East{' '}
            <span className="text-yellow-400">Drive</span> with Us
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
            Premium car rentals at affordable prices in Shillong & Guwahati.
            Choose from our wide selection of vehicles.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="#featured-cars"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
            >
              Browse Cars
            </a>

            <button
              onClick={() => setShowVideo(true)}
              className="border border-white/30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-white/10 transition backdrop-blur-sm"
            >
              <FaPlay />
              <span>Watch Video</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">🛡</span>
              <span className="text-sm">Fully Insured</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⏰</span>
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm">5-Star Rated</span>
            </div>
          </div>

          {/* Glass Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-xs text-gray-300 mt-1">Premium Cars</div>
            </div>

            <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-xs text-gray-300 mt-1">Happy Customers</div>
            </div>

            <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs text-gray-300 mt-1">Support</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Booking Card */}
        <div className="w-full max-w-md justify-self-end">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              Quick Booking
            </h3>
            <BookingForm />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-yellow-400 transition"
            >
              ×
            </button>

            <iframe
              className="w-full h-full rounded-xl"
              src="YOUR_VIDEO_URL_HERE"
              title="Rupali Travels"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
