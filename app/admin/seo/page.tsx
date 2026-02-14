import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SEOSettings from '@/components/admin/SEOSettings';

export default async function SEOPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          SEO Settings
        </h1>
        <p className="text-gray-600">
          Manage your website s SEO configuration, sitemap, and search engine optimization.
        </p>
      </div>

      <SEOSettings />
    </>
  );
}
