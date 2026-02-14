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
            Ready to Hit the Road?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of satisfied customers who trust DriveNow Rentals for their transportation needs. 
            Book now and experience premium car rental service.
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
              href="tel:+12345678900"
              className="flex items-center space-x-3 text-white hover:text-gold transition-colors"
            >
              <div className="bg-gold p-3 rounded-full">
                <FaPhone className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-300">Call Us Now</div>
                <div className="font-semibold text-lg">+91 84150 38275</div>
              </div>
            </a>

            <a
              href="mailto:rupalitravelagency@gmail.com
"
              className="flex items-center space-x-3 text-white hover:text-gold transition-colors"
            >
              <div className="bg-gold p-3 rounded-full">
                <FaEnvelope className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-300">Email Us</div>
                <div className="font-semibold text-lg">rupalitravelagency@gmail.com
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
