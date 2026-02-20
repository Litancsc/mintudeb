import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateMetadata as genMeta } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site'; // ✅ Correct
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { FaCalendar, FaUser, FaFolder, FaTag } from 'react-icons/fa';
import RelatedPostsClient from '@/components/blog/RelatedPostsClient';

// TypeScript interfaces
interface BlogPostParams {
  params: Promise<{ slug: string }>;
}

interface BlogPostData {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  categories?: string[];
  tags?: string[];
  views?: number;
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

// ✅ Fetch a single blog post
async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  await dbConnect();
  const post = await BlogPost.findOne({ slug, published: true }).lean();
  if (!post) return null;

  // Increment views count
  await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
  return JSON.parse(JSON.stringify(post));
}

// ✅ Fetch related posts
async function getRelatedPosts(currentPostId: string, categories: string[]): Promise<BlogPostData[]> {
  await dbConnect();
  const posts = await BlogPost.find({
    _id: { $ne: currentPostId },
    published: true,
    categories: { $in: categories },
  })
    .limit(10)
    .sort({ publishedAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(posts));
}

// ✅ Dynamic Metadata for SEO
export async function generateMetadata({ params }: BlogPostParams) {
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  const post = await getBlogPost(slug);
  const siteUrl = getSiteUrl();

  // 404 metadata
  if (!post) {
    return genMeta({
      title: 'Post Not Found',
      description: 'The blog post could not be found.',
      canonical: `${siteUrl}/blog`, // ✅ Ensures canonical points to /blog
      noindex: true,
    });
  }

  // Valid post metadata
  return genMeta({
    title: post.metaTitle || `${post.title} | Cloudhills`,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords ? [post.metaKeywords] : undefined,
    ogImage: post.featuredImage,
    ogType: 'article',
    canonical: `${siteUrl}/blog/${post.slug}`, // ✅ Valid canonical
  });
}

// ✅ Blog Post Page
export default async function BlogPostPage({ params }: BlogPostParams) {
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post._id, post.categories || []);
  const siteUrl = getSiteUrl();

  // ✅ Structured Data (Schema.org)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Cloudhills',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
  };

  return (
    <>
      {/* ✅ Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* ✅ Featured Image / Hero Section */}
        <div className="relative h-96 bg-cover bg-center">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover opacity-80"
            priority
           
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
         
        </div>

        {/* ✅ Blog Post Content */}
        <article className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            {/* Post Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center space-x-1">
                <FaCalendar className="text-gold" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FaUser className="text-gold" />
                <span>{post.author}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FaTag className="text-gold" />
                <span>{post.views || 0} views</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {post.title}
            </h1>

            {/* Categories + Tags */}
            <div className="flex flex-wrap gap-4 mb-8">
              {/* ✅ Categories */}
              {Array.isArray(post.categories) && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((cat: string, idx: number) => (
                    <Link
                      key={idx}
                      href={`/blog?category=${encodeURIComponent(cat)}`}
                      className="badge bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                      <FaFolder className="inline mr-1" />
                      {cat}
                    </Link>
                  ))}
                </div>
              )}

              {/* ✅ Tags */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="badge badge-gold text-xs">
                      <FaTag className="inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="text-xl text-gray-600 mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-gold">
              {post.excerpt}
            </div>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none justify">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, '<br />'),
                }}
              />
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-primary mb-4">Share this post:</h3>
              <div className="flex space-x-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post.title
                  )}&url=${encodeURIComponent(`${siteUrl}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `${siteUrl}/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    `${siteUrl}/blog/${post.slug}`
                  )}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* ✅ Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="section-padding bg-gray-50">
            <div className="container-custom">
              <h2 className="heading-md mb-8">Related Posts</h2>
              <RelatedPostsClient posts={relatedPosts} />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};