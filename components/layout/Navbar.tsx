'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCar, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';


/* ----------------------------------
 * Types
 * ---------------------------------- */

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface MenuItem {
  _id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  location: string;
  openInNewTab: boolean;
  parentId?: string | null;
  children?: MenuItem[];
}

/* ----------------------------------
 * Component
 * ---------------------------------- */


const Navbar = () => {
  const [siteName, setSiteName] = useState("CloudHills");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [seenIds, setSeenIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('seenNotifications');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const pathname = usePathname();

  /* ----------------------------------
   * Scroll behavior
   * ---------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ----------------------------------
   * Fetch menu items
   * ---------------------------------- */

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch('/api/menus?location=header');
        if (!res.ok) return;

        const data: MenuItem[] = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  /* ----------------------------------
   * Fetch notifications
   * ---------------------------------- */

  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications?active=true');
        if (!res.ok) return;

        const data: Notification[] = await res.json();
        if (mounted) setNotifications(data);
      } catch {
        // ignore
      }
    };

    fetchNotifications();
    const id = setInterval(fetchNotifications, 60000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  /* ----------------------------------
   * Navigation helpers
   * ---------------------------------- */

  const isActive = (path: string) => pathname === path;

  const unreadCount = notifications.filter(
    n => !seenIds.includes(n._id)
  ).length;

  /* ----------------------------------
   * Render menu item
   * ---------------------------------- */

  const renderMenuItem = (item: MenuItem, isMobile = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openDropdown === item._id;

    if (hasChildren && !isMobile) {
      return (
        <div
          key={item._id}
          className="relative"
          onMouseEnter={() => setOpenDropdown(item._id)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            className={`font-medium transition-colors flex items-center gap-1 ${isActive(item.href)
              ? 'text-gold'
              : isScrolled
                ? 'text-gray-700 hover:text-gold'
                : 'text-white hover:text-gold'
              }`}
          >
            {item.label}
            <FaChevronDown className="text-xs" />
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[200px] z-50">
              {item.children?.map(child => (
                <Link
                  key={child._id}
                  href={child.href}
                  target={child.openInNewTab ? '_blank' : undefined}
                  rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gold transition-colors"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item._id}
        href={item.href}
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        className={`font-medium transition-colors ${isMobile
          ? isActive(item.href)
            ? 'text-gold'
            : 'text-gray-700 hover:text-gold'
          : isActive(item.href)
            ? 'text-gold'
            : isScrolled
              ? 'text-gray-700 hover:text-gold'
              : 'text-white hover:text-gold'
          }`}
        onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
      >
        {item.label}
      </Link>
    );
  };

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const res = await fetch('/api/admin/seo-settings');
        if (!res.ok) return;

        const data = await res.json();
        if (data?.siteName) {
          setSiteName(data.siteName);
        }
      } catch (err) {
        console.error("Failed to fetch SEO settings:", err);
      }
    };

    fetchSEO();
  }, []);
  /* ----------------------------------
   * Render
   * ---------------------------------- */

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'backdrop-blur-md bg-white/70 shadow-xl border-b border-gray-200/40'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

          {/* ================= Logo ================= */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-yellow-400/40 transition-all duration-300">
                <FaCar className="text-white text-lg" />
              </div>
              <div className="absolute -inset-1 bg-yellow-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-800">
                {siteName}
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                Agency
              </p>
            </div>
          </Link>

          {/* ================= Desktop Navigation ================= */}
          <nav className="hidden lg:flex items-center space-x-2">
            {menuItems.map((item) => {
              const active = isActive(item.href);

              return (
                <div key={item._id} className="relative group">
                  {item.children && item.children.length > 0 ? (
                    <>
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                          ? 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                      >
                        {item.label}
                        <FaChevronDown className="text-xs" />
                      </button>

                      {/* Dropdown */}
                      <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child._id}
                              href={child.href}
                              target={child.openInNewTab ? '_blank' : undefined}
                              rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                        ? 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ================= Right Side (Notifications + CTA) ================= */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(v => !v)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM8 18a2 2 0 104 0H8z" />
                </svg>

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-4">
                    <h4 className="font-semibold mb-3">Notifications</h4>

                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-500">No notifications</p>
                    ) : (
                      <ul className="space-y-3 max-h-64 overflow-y-auto">
                        {notifications.slice(0, 8).map((n) => (
                          <li
                            key={n._id}
                            className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                          >
                            <div className="text-sm font-medium text-gray-800">
                              {n.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {n.message}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}


            <a href="tel:+917085901345"
              className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-yellow-400/40 transition">
              Reserve Now
            </a>
          </div>

          {/* ================= Mobile Toggle ================= */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* ================= Mobile Menu ================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item._id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <a href="tel:+917085901345"
                  className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-yellow-400/40 transition">
                  Reserve Now
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;