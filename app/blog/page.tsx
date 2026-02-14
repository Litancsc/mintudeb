import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateMetadata as genMeta } from '@/lib/seo';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { FaCalendar, FaUser, FaFolder, FaArrowRight } from 'react-icons/fa';


// TypeScript interfaces
interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

interface BlogPostData {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  publishedAt?: Date;
  createdAt: Date;
  categories?: string[];
  tags?: string[];
  views?: number;
  published: boolean;
}

// 🟢 added fallback-safe environment variables
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Rupali Travel Agency in Shillong';

// 🟢 changed from `export const metadata = ...` to a function for dynamic environments (Vercel friendly)
export async function generateMetadata() {
  return genMeta({
    title: `Car Rental Blog - Tips, Guides & News | ${siteName}`,
    description: `Expert advice on car rentals, driving tips, travel guides, and automotive news. Stay informed with the ${siteName} blog.`,
    keywords: [
      'car rental blog',
      'driving tips',
      'travel guides',
      'car maintenance',
      'road trip advice',
    ],
    canonical: `${siteUrl}/blog`,
    ogImage: `${siteUrl}/images/og-image.jpg`,
    ogType: 'article',
  });
}

async function getBlogPosts(category?: string, page = 1, pageSize = 6): Promise<{ posts: BlogPostData[]; total: number }> {
  try {
    await dbConnect();
    const query: Record<string, unknown> = { published: true };
    if (category) {
      // match when category is present in the categories array (case-insensitive)
      const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`^${escapeRegExp(category)}$`, 'i');
      query.categories = { $in: [re] };
    }

    const total = await BlogPost.countDocuments(query);

    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((Math.max(1, page) - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return { posts: JSON.parse(JSON.stringify(posts)), total };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], total: 0 };
  }
}

async function getAllCategories(): Promise<string[]> {
  try {
    await dbConnect();
    const cats = await BlogPost.distinct('categories', { published: true });
    return (cats || []).map((c: string) => String(c));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category;
  const pageParam = parseInt(String(resolvedParams?.page ?? '1'), 10) || 1;
  const pageSize = 6; // change as needed

  // fetch posts filtered by category (if provided) with pagination
  const { posts, total } = await getBlogPosts(category, pageParam, pageSize);
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  // fetch all categories for the sidebar
  const uniqueCategories = await getAllCategories();

  // helper to build href preserving category and page
  const makeHref = (p?: number) => {
    const parts: string[] = [];
    if (category) parts.push(`category=${encodeURIComponent(category)}`);
    if (p && p > 1) parts.push(`page=${p}`);
    return `/blog${parts.length ? `?${parts.join('&')}` : ''}`;
  };

  // ✅ Blog Schema Markup
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteName} Blog`,
    description: `Official blog of ${siteName}. Get car rental tips, travel advice, and news.`,
    url: `${siteUrl}/blog`,
  };

  return (
    <>
      {/* ✅ Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
          <div className="container-custom">
            <h1 className="heading-lg mb-4">{siteName} Blog</h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              Expert advice, travel tips, and the latest news in the world of car rentals
            </p>
          </div>
        </section>

        {/* Blog Content */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-4">
                      No blog posts published yet.
                    </p>
                    <p className="text-gray-500">
                      Check back soon for exciting content!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {posts.map((post: BlogPostData, idx: number) => (
                      <article
                        key={post._id || idx}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
                      >
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Featured Image */}
                          <div className="md:col-span-1 relative h-64 md:h-auto">
                            <Image
                              src={post.featuredImage || '/images/default-blog.jpg'}
                              alt={post.title || 'Blog post'}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>

                          {/* Content */}
                          <div className="md:col-span-2 p-6">
                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center space-x-1">
                                <FaCalendar className="text-gold" />
                                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <FaUser className="text-gold" />
                                <span>{post.author || 'Admin'}</span>
                              </span>
                            </div>

                            {/* Categories */}
                            {post.categories && post.categories.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {post.categories.map((cat: string, idx: number) => (
                                  <span key={idx} className="badge badge-gold text-xs">
                                    <FaFolder className="inline mr-1" />
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-primary mb-3 hover:text-gold transition-colors">
                              <Link href={`/blog/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h2>

                            {/* Excerpt */}
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {post.excerpt || 'Read more about this topic...'}
                            </p>

                            {/* Read More */}
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center space-x-2 text-gold hover:text-gold-dark font-semibold"
                            >
                              <span>Read More</span>
                              <FaArrowRight />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex items-center justify-center space-x-3">
                        {/* Prev */}
                        <Link href={makeHref(pageParam > 1 ? pageParam - 1 : 1)}
                          className={`px-4 py-2 rounded-md border ${pageParam <= 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                          Prev
                        </Link>

                        {/* Page numbers (show up to 5 pages centered) */}
                        <div className="flex items-center space-x-2">
                          {Array.from({ length: totalPages }).map((_, i) => {
                            const p = i + 1;
                            return (
                              <Link
                                key={p}
                                href={makeHref(p)}
                                className={`px-3 py-1 rounded ${p === pageParam ? 'bg-primary text-white' : 'border'}`}
                              >
                                {p}
                              </Link>
                            );
                          })}
                        </div>

                        {/* Next */}
                        <Link href={makeHref(pageParam < totalPages ? pageParam + 1 : totalPages)}
                          className={`px-4 py-2 rounded-md border ${pageParam >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}>
                          Next
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                {/* Categories */}
                {uniqueCategories.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-primary mb-4">Categories</h3>
                    <ul className="space-y-2">
                      {uniqueCategories.map((category: string, index: number) => (
                        <li key={index}>
                          <Link
                            href={`/blog?category=${encodeURIComponent(category)}`}
                            className="flex items-center space-x-2 text-gray-700 hover:text-gold transition-colors"
                          >
                            <FaFolder className="text-gold" />
                            <span>{category}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recent Posts */}
                {posts.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-primary mb-4">Recent Posts</h3>
                    <ul className="space-y-4">
                      {posts.slice(0, 5).map((post: BlogPostData, idx: number) => (
                        <li key={post._id || idx}>
                          <Link href={`/blog/${post.slug}`} className="group">
                            <h4 className="font-semibold text-gray-800 group-hover:text-gold transition-colors line-clamp-2 mb-1">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatDate(post.publishedAt || post.createdAt)}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}