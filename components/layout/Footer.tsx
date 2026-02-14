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

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gold p-2 rounded-lg">
                <FaCar className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold">
                Rupali Travel <span className="text-gold">Agency In Shillong</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted partner for premium car rentals. We offer a wide selection of vehicles to meet all your driving needs.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links - Dynamic from CMS */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold">Quick Links</h3>
            <ul className="space-y-2">
              {menuItems.slice(0, 6).map(item => (
                <li key={item._id}>
                  <Link
                    href={item.href}
                    target={item.openInNewTab ? '_blank' : undefined}
                    rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="text-gray-300 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold">Car Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cars?type=Economy" className="text-gray-300 hover:text-gold transition-colors">
                  Economy Cars
                </Link>
              </li>
              <li>
                <Link href="/cars?type=Luxury" className="text-gray-300 hover:text-gold transition-colors">
                  Luxury Cars
                </Link>
              </li>
              <li>
                <Link href="/cars?type=SUV" className="text-gray-300 hover:text-gold transition-colors">
                  SUVs
                </Link>
              </li>
              <li>
                <Link href="/cars?type=Sports" className="text-gray-300 hover:text-gold transition-colors">
                  Sports Cars
                </Link>
              </li>
              <li>
                <Link href="/cars?type=Electric" className="text-gray-300 hover:text-gold transition-colors">
                  Electric Cars
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-gold mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Milan Compound, Upper Mawprem, Garikhana, Shillong, Meghalaya 793002
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-gold flex-shrink-0" />
                <a href="tel:+8415038275" className="text-gray-300 hover:text-gold transition-colors">
                  +91 84150 38275
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-gold flex-shrink-0" />
                <a href="mailto:rupalitravelagency@gmail.com" className="text-gray-300 hover:text-gold transition-colors">
                  rupalitravelagency@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                <strong>Hours:</strong><br />
                Mon-Fri: 8:00 AM - 8:00 PM<br />
                Sat-Sun: 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Rupali Travel Agency In Shillong. All rights reserved.{' '}
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link href="/terms-of-service" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </p>
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

    </footer>
  );
};

export default Footer;