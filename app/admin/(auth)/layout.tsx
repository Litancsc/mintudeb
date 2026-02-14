import type { Metadata } from 'next';
import { Providers } from '../../providers'; 
import './admin.css'; // optional: separate styling

export const metadata: Metadata = {
  title: 'Admin Panel | Rupali Travel Rentals',
  description: 'Manage cars, bookings, and users securely.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 antialiased">
        <Providers>
          {/* No Navbar or Footer here */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
