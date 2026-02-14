import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto py-16 px-4 mt-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Information Collection</h2>
      <p className="mb-4">We collect information you provide directly, such as when you contact us or make a booking. We may also collect usage data automatically.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Use of Information</h2>
      <p className="mb-4">We use your information to provide and improve our services, process bookings, and communicate with you.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Data Protection</h2>
      <p className="mb-4">We implement security measures to protect your data. We do not sell or share your personal information except as required by law.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p>If you have questions about this Privacy Policy, please contact us at info@drivenow.com.</p>
    </div>
    <Footer />
    </>
  );
}
