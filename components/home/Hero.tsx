'use client';

import { useState } from 'react';
import BookingForm from './BookingForm';
import { FaPlay } from 'react-icons/fa';

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24 lg:pt-28">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920')",
        }}
      >
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 mt-15">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <div className="text-white animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-snug">
              Discover the Beauty of North East <span className="text-gold">Drive</span> with Us
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Premium car rentals at affordable prices Shillong ,Guwahati. Choose from our wide selection of vehicles.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#featured-cars" className="btn-primary">
                Browse Cars
              </a>
              <button
                onClick={() => setShowVideo(true)}
                className="btn-outline flex items-center space-x-2"
              >
                <FaPlay />
                <span>Watch Video</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <div className="text-4xl font-bold text-gold">500+</div>
                <div className="text-gray-300 mt-1">Premium Cars</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gold">10K+</div>
                <div className="text-gray-300 mt-1">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gold">24/7</div>
                <div className="text-gray-300 mt-1">Support</div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="animate-slide-up">
            <BookingForm />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gold transition-colors"
            >
              ×
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src="https://rr3---sn-ajh555-5j.googlevideo.com/videoplayback?expire=1769889762&ei=wkN-aZasCPi5rtoP7p7eAQ&ip=117.209.111.23&id=faa47576b9e79b0d&itag=18&source=picasa&begin=0&requiressl=yes&xpc=Eghoy-b0JXoBAQ==&met=1769882562,&mh=ak&mm=32&mn=sn-ajh555-5j&ms=su&mv=m&mvi=3&pl=21&rms=su,su&sc=yes&susc=ph&app=fife&ic=945&pcm2=yes&mime=video/mp4&vprv=1&prv=1&rqh=1&dur=19.481&lmt=1758996165413364&mt=1769881765&txp=0000224&sparams=expire,ei,ip,id,itag,source,requiressl,xpc,susc,app,ic,pcm2,mime,vprv,prv,rqh,dur,lmt&sig=AJEij0EwRQIhAN17u-718eAcO8VHTjRy-Ji4Xt0QCLTUonuWIBf7E5Z6AiB06W3trW1zJrzbmwkbEMv9oOSvVtOsh-6C_9z_aAnP3g==&lsparams=met,mh,mm,mn,ms,mv,mvi,pl,rms,sc&lsig=APaTxxMwRgIhAIL9HCTiiNcI0P4IbVsL8Dd6alEOafs5uji2YoGQsdSpAiEA7sGxLexTh551xR8SSl7VYcIs8bZ-y-FoftxeA2-ysKk="
              title="Rupali Travels"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
