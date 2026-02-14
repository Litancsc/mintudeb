import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/site';

export async function GET() {
  const siteUrl = getSiteUrl();

  const robotsTxt = `# Robots.txt for ${siteUrl}

# Allow all crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /notifications
Disallow: /dashboard
Disallow: /profile
Disallow: /_next/
Disallow: /search?*

# Allow crawling of public assets
Allow: /api/og
Allow: /_next/static/
Allow: /_next/image

# Google Bot specific rules (optional)
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/auth/

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: { 
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}