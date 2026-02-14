import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Fetch page data
async function getPage(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/pages?slug=${slug}&published=true`,
      {
        cache: 'no-store', // Always fetch fresh data
      }
    ); 

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;

  const page = await getPage(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.excerpt,
    keywords: page.metaKeywords,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.excerpt,
      images: page.featuredImage ? [page.featuredImage] : [],
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  const page = await getPage(slug);

  if (!page || !page.isPublished) {
    notFound();
  }
  return (

  <>
  <Navbar/> 
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {page.featuredImage && (
        <div
          className="relative h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${page.featuredImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4 mt-8">{page.title}</h1>
              {page.excerpt && (
                <p className="text-xl max-w-2xl mx-auto">{page.excerpt}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {!page.featuredImage && (
            <h1 className="text-4xl font-bold text-primary mb-8">{page.title}</h1>
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

          {/* Page Content - Rich Text */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
      </div>
      
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/918415038275"
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