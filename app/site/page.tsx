import Hero from '@/components/home/Hero';
import FeaturedCars from '@/components/home/FeaturedCars';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import NotificationBanner from '@/components/NotificationBanner';

// Metadata is now handled by template.tsx

export default function Home() {
  return (
    <>
      <NotificationBanner />
      <main>
        <Hero />
        <Features />
        <FeaturedCars />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
    </>
  );
}