import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import BlogPost from '@/models/BlogPost';
import Service from '@/models/Service';
import Location from '@/models/Location';
import ServicePage from '@/models/ServicePage';

interface SitemapUrl {
  url: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
  image?: string;
}

interface ICmsPage {
  slug: string;
  updatedAt?: string;
  isPublished?: boolean;
  featuredImage?: string;
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  const currentDate = new Date().toISOString();
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

  try {
    await dbConnect();

    // 1️⃣ Static pages
    const staticPages: SitemapUrl[] = [
      { url: `${baseUrl}/`, changefreq: 'daily', priority: 1.0 },
      { url: `${baseUrl}/cars`, changefreq: 'daily', priority: 0.9 },
      { url: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/blog`, changefreq: 'daily', priority: 0.8 },
      { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/notifications`, changefreq: 'weekly', priority: 0.6 },
    ];

    // 2️⃣ Cars
    const cars = await Car.find({ available: true }).select('slug updatedAt').lean();
    const carUrls: SitemapUrl[] = cars.map(car => ({
      url: `${baseUrl}/cars/${car.slug}`,
      lastmod: car.updatedAt ? new Date(car.updatedAt).toISOString() : currentDate,
      changefreq: 'weekly',
      priority: 0.8,
    }));

    // 3️⃣ Blog posts
    const posts = await BlogPost.find({ published: true }).select('slug updatedAt').lean();
    const blogUrls: SitemapUrl[] = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString() : currentDate,
      changefreq: 'monthly',
      priority: 0.7,
    }));

    // 4️⃣ Service / Location pages (from Service & Location models)
    const services = await Service.find({ active: true }).select('slug').lean();
    const locations = await Location.find({ active: true }).select('slug').lean();
    const serviceLocationUrls: SitemapUrl[] = [];
    for (const service of services) {
      for (const location of locations) {
        serviceLocationUrls.push({
          url: `${baseUrl}/services/${service.slug}/${location.slug}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.85,
        });
      }
    }

    // 5️⃣ CMS pages (from API)
    let cmsPages: ICmsPage[] = [];
    try {
      const res = await fetch(`${baseUrl}/api/pages?published=true`, { cache: 'force-cache' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) cmsPages = data;
      }
    } catch (err) {
      console.error('Error fetching CMS pages:', err);
    }

    const cmsUrls: SitemapUrl[] = cmsPages
      .filter(page => page.slug)
      .map(page => ({
        url: `${baseUrl}/${page.slug.replace(/^\/|\/$/g, '')}`,
        lastmod: page.updatedAt ? new Date(page.updatedAt).toISOString() : currentDate,
        changefreq: 'monthly',
        priority: 0.7,
      }));

    // 6️⃣ Service Pages (admin-created via ServicePage model)
    const servicePages = await ServicePage.find({ isPublished: true }).select('serviceSlug locationSlug updatedAt').lean();
    const serviceUrls: SitemapUrl[] = servicePages.map(page => ({
      url: `${baseUrl}/services/${page.serviceSlug}/${page.locationSlug}`,
      lastmod: page.updatedAt ? new Date(page.updatedAt).toISOString() : currentDate,
      changefreq: 'weekly',
      priority: 0.85,
    }));

    // 7️⃣ Combine all URLs
    const allUrls: SitemapUrl[] = [
      ...staticPages,
      ...carUrls,
      ...blogUrls,
      ...serviceLocationUrls,
      ...cmsUrls,
      ...serviceUrls,
    ];

    // 8️⃣ Generate XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${escapeXml(u.url)}</loc>
    <lastmod>${u.lastmod || currentDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    return new NextResponse('Sitemap generation failed', { status: 500 });
  }
}
