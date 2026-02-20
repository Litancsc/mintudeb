import Link from 'next/link';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-transparent opacity-95" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <h2 className="heading-lg text-white mb-6">
            Explore Meghalaya in Style with CloudHills
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Discover the beauty of North East India with our premium car rental services.
            Reliable rides, professional drivers, and unforgettable journeys—Book your adventure today!
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/cars" className="btn-primary">
              Browse Available Cars
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-6">
            <a
              href="tel:+917085901345"
              className="flex items-center space-x-3 text-white hover:text-gold transition-colors"
            >
              <div className="bg-gold p-3 rounded-full">
                <FaPhone className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-300">Call Us Now</div>
                <div className="font-semibold text-lg">+91 70859 01345</div>
              </div>
            </a>

            <a
              href="mailto:litanpaulcsc@gmail.com
"
              className="flex items-center space-x-3 text-white hover:text-gold transition-colors"
            >
              <div className="bg-gold p-3 rounded-full">
                <FaEnvelope className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-300">Email Us</div>
                <div className="font-semibold text-lg">Litanpaulcsc@gmail.com
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold opacity-20" />
    </section>
  );
};

export default CTASection;
