'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCar, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

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

const Footer = () => {
   const [siteName, setSiteName] = useState("CloudHills");
  const currentYear = new Date().getFullYear();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch('/api/menus?location=footer');
        if (!res.ok) return;

        const data: MenuItem[] = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching footer menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);
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
  return (
    <footer className="bg-primary text-white relative overflow-hidden">

      {/* ================= Newsletter Section ================= */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
          
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Stay Updated with {siteName}
              </h3>
              <p className="text-white/80 max-w-md">
                Get exclusive offers, new car updates, and travel deals directly in your inbox.
              </p>
            </div>

            <div className="lg:justify-self-end w-full max-w-md">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button className="px-5 py-2 rounded-lg bg-gold hover:bg-yellow-500 text-white font-medium transition shadow-lg">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-white/60 mt-2">
                No spam. Unsubscribe anytime.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= Main Footer ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10">

          {/* ===== Brand Section ===== */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center shadow-lg">
                <FaCar className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  {siteName}
                </h1>
                <p className="text-sm text-white/70 -mt-1">
                  Agency
                </p>
              </div>
            </div>

            <p className="text-white/80 mb-6 leading-relaxed">
              Your trusted partner for premium car rentals in Shillong.
              Luxury, comfort, and reliability in every journey.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ===== Quick Links (Dynamic CMS) ===== */}
          <div>
            <h4 className="font-semibold mb-5 text-gold">Quick Links</h4>
            <ul className="space-y-3">
              {menuItems.slice(0, 6).map((item) => (
                <li key={item._id}>
                  <Link
                    href={item.href}
                    target={item.openInNewTab ? '_blank' : undefined}
                    rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="text-white/80 hover:text-gold transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Car Categories ===== */}
          <div>
            <h4 className="font-semibold mb-5 text-gold">Car Categories</h4>
            <ul className="space-y-3 text-sm">
              {["Economy", "Luxury", "SUV", "Sports", "Electric"].map((type) => (
                <li key={type}>
                  <Link
                    href={`/cars?type=${type}`}
                    className="text-white/80 hover:text-gold transition-colors"
                  >
                    {type} Cars
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Contact Info ===== */}
          <div>
            <h4 className="font-semibold mb-5 text-gold">Contact Us</h4>
            <ul className="space-y-4 text-sm">

              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-gold mt-1" />
                <span className="text-white/80">
                 Riti Complex, opposite Municipal Market, Laban, Shillong, Meghalaya 793004, India

                </span>
              </li>

              <li className="flex items-center space-x-3">
                <FaPhone className="text-gold" />
                <a href="tel:+917085901345" className="text-white/80 hover:text-gold transition">
                  +91 70859 01345
                </a>
              </li>

              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-gold" />
                <a href="mailto:rupalitravelagency@gmail.com" className="text-white/80 hover:text-gold transition">
                  Litanpaulcsc@gmail.com
                </a>
              </li>
            </ul>

            <p className="text-xs text-white/60 mt-4">
              Mon-Fri: 8AM - 8PM <br />
              Sat-Sun: 9AM - 6PM
            </p>
          </div>

        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <div>
              © {currentYear} {siteName}. All rights reserved.
            </div>

            <div className="flex items-center space-x-6">
              <Link href="/privacy-policy" className="hover:text-gold transition">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-gold transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WhatsApp Floating Button ================= */}
      <a
        href="https://wa.me/918415038275"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl flex items-center justify-center z-50 transition"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2C6.48 2 2 6.5 2 12.04c0 2.13.56 4.11 1.54 5.84L2 22l4.31-1.42a9.957 9.957 0 005.73 1.65C17.56 22.23 22 17.76 22 12.04 22 6.48 17.52 2 12.04 2z" />
        </svg>
      </a>

    </footer>
  );
};
export default Footer;