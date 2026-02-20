import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/ContactForm';
import { generateMetadata as genMeta } from '@/lib/seo';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export const metadata = genMeta({
  title: 'Contact Us - Cloudhills In Shillong',
  description: 'Get in touch with Cloudhills In Shillong. We\'re here to help with bookings, inquiries, and support. Call, email, or visit us today.',
  keywords: ['contact Cloudhills In Shillong', 'car rental support', 'booking inquiries', 'customer service'],
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
              Have questions? We re here to help. Reach out to us anytime!
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
                        Riti Complex, opposite Municipal Market,<br /> Laban, Shillong,<br /> Meghalaya 793004

                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Address</h3>
                      <p className="text-gray-600">
                        South Anandanagar,<br /> Srinagar, West,<br /> Tripura 799004
                        M-9612011797
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
                        Main: <a href="tel:7085901345" className="hover:text-gold">+91 70859 01345</a><br />
                        Toll Free: <a href="tel:+7085901345" className="hover:text-gold">+91 70859 01345</a>
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
                        General: <a href="mailto:Litanpaul.csc@gmail.com" className="hover:text-gold">Litanpaul.csc@gmail.com</a><br />
                        Support: <a href="mailto:Litanpaul.csc@gmail.com" className="hover:text-gold">Litanpaul.csc@gmail.com</a>
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
                {/* Map */}
                <div className="mt-8 rounded-xl overflow-hidden shadow-lg h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.077974232131!2d91.8765355!3d25.5639847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37507f39f3e7baa5%3A0x7ae92a23ca682b56!2sMiles%20For%20Smiles%20Tours%20%26%20Travels!5e0!3m2!1sen!2sin!4v1708189568132!5m2!1sen!2sin"
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
