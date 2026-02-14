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
            className={`font-medium transition-colors flex items-center gap-1 ${
              isActive(item.href)
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
        className={`font-medium transition-colors ${
          isMobile
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

  /* ----------------------------------
   * Render
   * ---------------------------------- */

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gold p-2 rounded-lg group-hover:scale-110 transition-transform">
              <FaCar className="text-2xl text-white" />
            </div>
            <span
              className={`text-2xl font-bold ${
                isScrolled ? 'text-primary' : 'text-white'
              }`}
            >
              Rupali<span className="text-gold"> Travel Agency </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map(item => renderMenuItem(item))}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(v => !v)}
                className={`relative inline-flex items-center justify-center rounded-full p-2 ${
                  isScrolled ? 'text-primary' : 'text-white'
                }`}
                aria-label="Notifications"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM8 18a2 2 0 104 0H8z" />
                </svg>

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-semibold">Notifications</h4>
                      <button
                        onClick={() => {
                          const ids = notifications.map(n => n._id);
                          setSeenIds(ids);
                          try {
                            localStorage.setItem(
                              'seenNotifications',
                              JSON.stringify(ids)
                            );
                          } catch {}
                        }}
                        className="text-sm text-gray-500 hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <ul className="space-y-3 max-h-64 overflow-y-auto">
                        {notifications.slice(0, 8).map(n => (
                          <li
                            key={n._id}
                            className={`p-3 rounded-lg ${
                              seenIds.includes(n._id)
                                ? 'bg-gray-50'
                                : 'bg-gray-100'
                            }`}
                          >
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium text-sm text-primary">
                                  {n.title}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {n.message}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 ml-2">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden text-2xl ${
              isScrolled ? 'text-primary' : 'text-white'
            }`}
            onClick={() => setIsMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4 bg-white rounded-lg shadow-lg p-6">
              {menuItems.map(item => (
                <div key={item._id}>
                  {renderMenuItem(item, true)}
                  {item.children && item.children.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.children.map(child => (
                        <Link
                          key={child._id}
                          href={child.href}
                          target={child.openInNewTab ? '_blank' : undefined}
                          rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block font-medium ${
                            isActive(child.href)
                              ? 'text-gold'
                              : 'text-gray-600 hover:text-gold'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;