import Hero from '@/components/home/Hero';
import FeaturedCars from '@/components/home/FeaturedCars';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NotificationBanner from '@/components/NotificationBanner';

export const metadata = {
  title: 'Home',
  description: 'Reliable car rental service in Shillong. Book affordable taxis, cabs, and luxury cars for airport transfers, sightseeing, and outstation trips. 24/7 service with professional drivers. Call 8415038275 for instant booking..',
  alternates: { canonical: '/' }, // 👈 correct canonical for homepage
};
export default function Home() {
    return (
    <>
    
      <NotificationBanner />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FeaturedCars />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
