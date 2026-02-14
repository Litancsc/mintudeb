import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function TermsOfServicePage() {
  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto py-16 px-4 mt-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">These Terms of Service govern your use of our website and services. By accessing or using our site, you agree to these terms.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Use of Service</h2>
      <p className="mb-4">You agree to use our services lawfully and not to misuse or attempt to disrupt our operations.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Bookings & Payments</h2>
      <p className="mb-4">All bookings are subject to availability. Payments must be made as per the instructions provided during booking.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Limitation of Liability</h2>
      <p className="mb-4">We are not liable for any indirect or consequential damages arising from your use of our services.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p>If you have questions about these Terms of Service, please contact us at info@drivenow.com.</p>
    </div>
    <Footer />
    </>
  );
}
