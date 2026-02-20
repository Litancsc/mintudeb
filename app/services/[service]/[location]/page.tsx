import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    service: string;
    location: string;
  }>;
}

interface PageData {
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  publishedAt?: string;
  featuredImage?: string;
}

// Default hero image if none is provided
const DEFAULT_HERO = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80";

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
// Simulate fetching page data
async function getPage(service: string, location: string) {
  // Replace this with your real database fetching logic
  // For now we mock the page data
  return {
    title: `${service} in ${location}`,
    excerpt: `Looking for reliable ${service.toLowerCase()} in ${location}? Cloudhills offers safe, affordable car rental with driver.`,
    content: `<section class="space-y-6">
      <p>Looking for a reliable <strong>${service.toLowerCase()} in ${location} with driver</strong>?<br/>
      <strong>Cloudhills</strong> provides safe, comfortable, and affordable car hire services for local travel and outstation trips.</p>
      <div class="bg-primary/10 p-6 rounded-lg">
        <h2 class="text-2xl font-bold text-primary mb-3">✈️ ${location} Airport ${service}</h2>
        <p>Need pickup or drop at International Airport? Book our airport ${service.toLowerCase()} with driver for smooth and on-time service.</p>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-primary mb-3">🌄 Outstation ${service} from ${location}</h2>
        <ul class="list-disc pl-6 space-y-1">
          <li>${location} sightseeing car rental</li>
          <li>${location} weekend tour car hire</li>
          <li>${location} family trip car rental</li>
        </ul>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-primary mb-3">🚘 Our Services Include</h2>
        <ul class="list-disc pl-6 space-y-1">
          <li>Car rental in ${location} with driver</li>
          <li>SUV rental ${location}</li>
          <li>Sedan car hire ${location}</li>
        </ul>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-primary mb-3">⭐ Why Choose Cloudhills?</h2>
        <ul class="list-disc pl-6 space-y-1">
          <li>Experienced drivers</li>
          <li>Clean & well-maintained vehicles</li>
          <li>Affordable prices</li>
        </ul>
      </div>
      <p>📞 Book your ${service.toLowerCase()} today at <strong>9865256480</strong></p>
    </section>`,
    author: "Cloudhills",
    publishedAt: new Date().toISOString(),
    featuredImage: "", // Empty to trigger default hero
  } as PageData;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service, location } = await params;
  const page = await getPage(service, location);

  return {
    title: page.title,
    description: page.excerpt,
    keywords: "",
  };
}

export default async function ServiceLocationPage({ params }: PageProps) {
  const { service, location } = await params;
  const page = await getPage(service, location);

  if (!page) notFound();

  const heroImage = page.featuredImage || DEFAULT_HERO;

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
          
          {page.excerpt && <p className="text-xl max-w-2xl mx-auto text-white">{page.excerpt}</p>}
          {/* CTA Button */}
          <Link
            href="#booking"
            className="mt-6 inline-block bg-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-gold/90 transition"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {!page.featuredImage && (
            <h1 className="text-4xl font-bold text-primary mb-8">{capitalizeWords(page.title)}</h1>
          )}

          {/* Page Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-4 border-b">
            {page.author && <span>By {page.author}</span>}
            {page.publishedAt && (
              <>
                <span>•</span>
                <time dateTime={page.publishedAt}>
                  {new Date(page.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </>
            )}
          </div>

          {/* Page Content */}
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />

          {/* Booking CTA Section */}
          <section id="booking" className="text-center mt-16">
            <h3 className="text-3xl font-bold text-primary mb-4">Ready to Book?</h3>
            <p className="text-gray-700 mb-6">Contact us now for instant quotes and availability.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Contact Us
              </Link>
              <Link
                href="/cars"
                className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                View Our Fleet
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/917085901345"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2C6.48 2 2 6.5 2 12.04c0 2.13.56 4.11 1.54 5.84L2 22l4.31-1.42a9.957 9.957 0 005.73 1.65C17.56 22.23 22 17.76 22 12.04 22 6.48 17.52 2 12.04 2zm0 18.05a8.014 8.014 0 01-4.36-1.27l-.31-.19-2.57.84.88-2.5-.21-.34A7.98 7.98 0 014.05 12c0-4.42 3.59-8.02 8-8.02 4.41 0 8 3.6 8 8.02 0 4.41-3.6 8-8 8zm3.71-5.89l-.44-2.09c-.06-.27-.31-.49-.59-.49l-1.66.03c-.28 0-.53.21-.58.49l-.22 1.25c-.06.34-.36.63-.7.72l-1.38.37c-.35.09-.57.45-.5.8l.28 1.31c.07.35.37.61.73.61h.01c3.05 0 5.53-2.48 5.53-5.53 0-.31-.25-.56-.56-.56z"/>
        </svg>
      </a>

      <Footer />
    </>
  );
}
