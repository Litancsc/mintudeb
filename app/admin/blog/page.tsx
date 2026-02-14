import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostsList from '@/components/admin/BlogPostsList';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

async function getBlogPosts() {
  try {
    await dbConnect();
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogManagementPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login');
  }

  const posts = await getBlogPosts();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Blog Posts
        </h1>
        <p className="text-gray-600">
          Create and manage your blog content with full SEO optimization.
        </p>
      </div>

      <BlogPostsList initialPosts={posts} />
    </>
  );
}
