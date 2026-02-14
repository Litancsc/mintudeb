import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/ContactForm';
import { generateMetadata as genMeta } from '@/lib/seo';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export const metadata = genMeta({
  title: 'Contact Us - Rupali Travel Agency In Shillong',
  description: 'Get in touch with Rupali Travel Agency In Shillong. We\'re here to help with bookings, inquiries, and support. Call, email, or visit us today.',
  keywords: ['contact Rupali Travel Agency In Shillong', 'car rental support', 'booking inquiries', 'customer service'],
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
          <div className="container-custom">
            <h1 className="heading-lg mb-4">Contact Us</h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              Have questions? We're here to help. Reach out to us anytime!
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="heading-md mb-6">Get In Touch</h2>
                <p className="text-gray-700 mb-8">
                  Whether you have a question about our vehicles, pricing, bookings, or anything else, 
                  our team is ready to answer all your questions.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gold p-3 rounded-lg flex-shrink-0">
                      <FaMapMarkerAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Address</h3>
                      <p className="text-gray-600">
                        Milan Compound, Upper Mawprem <br />
                        Garikhana, Shillong<br />
                        Meghalaya 793002
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-gold p-3 rounded-lg flex-shrink-0">
                      <FaPhone className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Phone</h3>
                      <p className="text-gray-600">
                        Main: <a href="tel:8415038275" className="hover:text-gold">+91 84150 38275</a><br />
                        Toll Free: <a href="tel:+8415038275" className="hover:text-gold">+91 84150 38275</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-gold p-3 rounded-lg flex-shrink-0">
                      <FaEnvelope className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Email</h3>
                      <p className="text-gray-600">
                        General: <a href="mailto:rupalitravelagency@gmail.com" className="hover:text-gold">rupalitravelagency@gmail.com</a><br />
                        Support: <a href="mailto:rupalitravelagency@gmail.com" className="hover:text-gold">rupalitravelagency@gmail.com</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-gold p-3 rounded-lg flex-shrink-0">
                      <FaClock className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 8:00 AM - 8:00 PM<br />
                        Saturday - Sunday: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-8 rounded-xl overflow-hidden shadow-lg h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.7779859688703!2d91.8699919!3d25.579052100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37507f2c9f17d985%3A0x60b0bea452f226dc!2sRupali%20travel%20agency%20in%20Shillong!5e0!3m2!1sen!2sin!4v1761295819756!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
