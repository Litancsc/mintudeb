'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  FaCar,
  FaTachometerAlt,
  FaCarSide,
  FaCalendarCheck,
  FaBlog,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaSearch,
  FaQuestionCircle,
  FaFileAlt,
  FaList,
} from 'react-icons/fa';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Cars', href: '/admin/cars', icon: FaCarSide },
    { name: 'Bookings', href: '/admin/bookings', icon: FaCalendarCheck },
    { name: 'Blog Posts', href: '/admin/blog', icon: FaBlog },
    { name: 'Pages', href: '/admin/pages', icon: FaFileAlt },
    { name: 'Menus', href: '/admin/menus', icon: FaList },
    { name: 'FAQ', href: '/admin/faq', icon: FaQuestionCircle },
    { name: 'Notifications', href: '/admin/notifications', icon: FaBell },
    { name: 'SEO Settings', href: '/admin/seo', icon: FaSearch },
    { name: 'Service Pages', href: '/admin/service-pages', icon: FaSearch },
  ];

  const isActive = (path: string) => pathname.startsWith(path);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 bg-primary shadow-xl`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="bg-gold p-2 rounded-lg">
                <FaCar className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                DriveNow <span className="text-gold">CMS</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-gold text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <FaHome className="text-lg" />
              <span className="font-medium">View Website</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`lg:ml-64 min-h-screen`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-2xl text-primary"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="text-sm text-gray-600">
              Admin Panel
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
