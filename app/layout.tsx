// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { getSEOSettings, generateLocalBusinessSchema } from '@/lib/seo';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// ✅ Force dynamic rendering for metadata
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Don't cache at all in development

/* ✅ DYNAMIC METADATA (FROM DB) */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSEOSettings();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  

  console.log( settings.googleSearchConsole);

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },

    description: settings.siteDescription,

    keywords: settings.siteKeywords?.split(',').map(k => k.trim()),

    verification: {
       google: settings.googleSearchConsole
    ?.replace(/.*content="([^"]+)".*/, '$1')
    ?.trim() || undefined,
    },

    openGraph: {
      type: 'website',
      url: siteUrl,
      siteName: settings.siteName,
      title: settings.siteName,
      description: settings.siteDescription,
      images: [
        {
          url:
            settings.defaultOgImage ||
            `${siteUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: settings.siteName,
      description: settings.siteDescription,
      images: [
        settings.defaultOgImage ||
          `${siteUrl}/images/og-image.jpg`,
      ],
      site: settings.twitterHandle || undefined,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = await generateLocalBusinessSchema();

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>

      <body className={`${poppins.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}