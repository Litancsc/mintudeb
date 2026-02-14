import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

// Fetch page data
async function getPage(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/page?slug=${slug}&published=true`, {
      cache: 'no-store', // Always fetch fresh data
    });

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
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPage(params.slug);

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
  const page = await getPage(params.slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {page.featuredImage && (
        <div
          className="relative h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${page.featuredImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">{page.title}</h1>
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
  );
}