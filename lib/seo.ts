// lib/seo.ts
import dbConnect from '@/lib/mongodb';
import SEOSettings from '@/models/SEOSettings';

// Types for SEO Settings
interface SEOSettingsType {
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  googleAnalyticsId?: string;
  googleSearchConsole?: string;
  facebookPixel?: string;
  twitterHandle?: string;
  defaultOgImage?: string;
}

// Cache for SEO settings to avoid repeated DB calls
let cachedSettings: SEOSettingsType | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60 * 1000; // ✅ Changed to 1 minute for faster updates

export async function getSEOSettings(): Promise<SEOSettingsType> {
  const now = Date.now();
  
  // Return cached settings if still valid
  if (cachedSettings && (now - cacheTime) < CACHE_DURATION) {
    console.log('📦 Using cached SEO settings');
    return cachedSettings;
  }

  try {
    await dbConnect();
    
    let settings = await SEOSettings.findOne().lean();
    
    if (!settings) {
      // Create default settings if none exist
      const newSettings = await SEOSettings.create({
        siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'CloudHills agency in Shillong',
        siteDescription: 'Taxi & Premium Car Rental Service - Affordable & Luxury Cars',
        siteKeywords: 'car rental, taxi service, shillong, meghalaya',
        defaultOgImage: '/images/og-image.jpg',
      });
      settings = newSettings.toObject();
    }
    
    cachedSettings = settings as SEOSettingsType;
    cacheTime = now;
    
    console.log('✅ Fresh SEO settings loaded from DB');
    return cachedSettings;
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    // Return default values if DB fetch fails
    return {
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'CloudHills agency in Shillong',
      siteDescription: 'Taxi & Premium Car Rental Service - Affordable & Luxury Cars',
      siteKeywords: 'car rental, taxi service, shillong, meghalaya',
      defaultOgImage: '/images/og-image.jpg',
    };
  }
}

// IMPORTANT: Call this function after saving settings to clear cache
export function clearSEOCache() {
  cachedSettings = null;
  cacheTime = 0;
  console.log('🗑️ SEO cache cleared');
}

function getSiteUrl(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').origin;
  } catch {
    return 'http://localhost:3000';
  }
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
}

export async function generateMetadata(seo: SEOData) {
  const siteUrl = getSiteUrl();
  const settings = await getSEOSettings();
  const siteName = settings.siteName || 'cloudhills';

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    robots: seo.noindex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: seo.canonical || siteUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical || siteUrl,
      siteName,
      images: [
        {
          url: seo.ogImage || settings.defaultOgImage || `${siteUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: 'en_US',
      type: seo.ogType || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage || settings.defaultOgImage || `${siteUrl}/images/og-image.jpg`],
      site: settings.twitterHandle,
    },
  };
}

export function generateCarSchema(car: {
  name: string;
  description: string;
  brand: string;
  model: string;
  mainImage: string;
  pricePerDay: number;
  available: boolean;
  slug: string;
}) {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: car.name,
    description: car.description,
    brand: { '@type': 'Brand', name: car.brand },
    model: car.model,
    image: car.mainImage,
    offers: {
      '@type': 'Offer',
      price: car.pricePerDay,
      priceCurrency: 'INR',
      availability: car.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/cars/${car.slug}`,
    },
  };
}

export async function generateLocalBusinessSchema() {
  const siteUrl = getSiteUrl();
  const settings = await getSEOSettings();

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: settings.siteName || 'CloudHills agency in Shillong',
    description: settings.siteDescription || 'Taxi & Premium Car Rental Service - Affordable & Luxury Cars',
    url: siteUrl,
    telephone: '+91 70859 01345',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Riti Complex, opposite Municipal Market, Laban',
      addressLocality: 'Shillong, Meghalaya',
      addressRegion: 'NE',
      postalCode: '793004',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.579163388589937',
      longitude: '91.87035668078006',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/share/1AnXnYFKYf/',
      'https://www.instagram.com/',
      'https://www.threads.com/@mintudeb8',
      'https://youtube.com/@mintudeb5211?si=R_KhAHNMgfHgu1pK'
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}