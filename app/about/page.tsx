import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateMetadata as genMeta } from '@/lib/seo';
import { FaAward, FaUsers, FaShieldAlt, FaHeart } from 'react-icons/fa';

export const metadata = genMeta({
  title: 'About Us - Rupali Travel Rentals',
  description: 'Learn about Rupali Travel Rentals, your trusted partner for premium car rentals. Committed to excellence, safety, and customer satisfaction since 2010.',
  keywords: ['about Rupali Travel', 'car rental ', 'our story', 'why choose us'],
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
          <div className="container-custom">
            <h1 className="heading-lg mb-4">About Rupali Travel Rentals</h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              Your trusted partner for premium car rentals. Excellence, safety, and customer satisfaction since 2010.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="heading-md mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Founded in 2010, Rupali Travel Rentals started with a simple mission: to provide high-quality, 
                  affordable car rental services to travelers and locals alike. Over the years, we have grown 
                  from a small fleet of 10 vehicles to a comprehensive collection of over 500 premium cars.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Our commitment to customer satisfaction, safety, and innovation has made us one of the 
                  leading car rental companies in the region. We continuously invest in the latest vehicles 
                  and technology to ensure you have the best driving experience possible.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Today, we serve thousands of satisfied customers annually, helping them reach their 
                  destinations comfortably and affordably. Whether you need a car for business, leisure, 
                  or a special occasion, Rupali Travel Rentals has the perfect vehicle for you.
                </p>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000"
                  alt="Our Fleet"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-md mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FaAward className="text-5xl" />,
                  title: 'Excellence',
                  description: 'We strive for excellence in every service we provide, from vehicle quality to customer support.',
                },
                {
                  icon: <FaUsers className="text-5xl" />,
                  title: 'Customer First',
                  description: 'Your satisfaction is our priority. We go the extra mile to ensure you have a great experience.',
                },
                {
                  icon: <FaShieldAlt className="text-5xl" />,
                  title: 'Safety',
                  description: 'All our vehicles are regularly maintained and fully insured for your peace of mind.',
                },
                {
                  icon: <FaHeart className="text-5xl" />,
                  title: 'Integrity',
                  description: 'Honest pricing, transparent policies, and ethical business practices in everything we do.',
                },
              ].map((value, index) => (
                <div key={index} className="bg-white rounded-xl p-8 text-center hover-lift shadow-lg">
                  <div className="text-gold mb-4 flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section-padding bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Years in Business', value: '14+' },
                { label: 'Happy Customers', value: '10K+' },
                { label: 'Premium Cars', value: '500+' },
                { label: 'Locations', value: '25+' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl font-bold text-gold mb-2">{stat.value}</div>
                  <div className="text-gray-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-md mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Dedicated professionals committed to your satisfaction
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'John Smith', role: 'CEO & Founder', image: 'https://ui-avatars.com/api/?name=John+Smith&background=D4AF37&color=fff&size=256' },
                { name: 'Sarah Johnson', role: 'Operations Manager', image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=D4AF37&color=fff&size=256' },
                { name: 'Michael Chen', role: 'Customer Service Lead', image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=D4AF37&color=fff&size=256' },
                { name: 'Emma Williams', role: 'Fleet Manager', image: 'https://ui-avatars.com/api/?name=Emma+Williams&background=D4AF37&color=fff&size=256' },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
