'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FAQItem from '@/components/FAQItem';
import { FaQuestionCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}


export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaqs() {
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      setFaqs(data);
      setLoading(false);
    }
    fetchFaqs();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
          <div className="container-custom">
            <div className="flex items-center justify-center mb-4">
              <FaQuestionCircle className="text-6xl text-gold" />
            </div>
            <h1 className="heading-lg mb-4 text-center">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto text-center">
              Everything you need to know about renting a car with DriveNow Rentals
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading FAQs...</div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No FAQs found.</div>
            ) : (
              <div className="space-y-8">
                {faqs.filter(faq => faq.active).map((faq, idx) => (
                  <FAQItem key={faq._id || idx} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-16 p-8 bg-gradient-to-r from-gold-light to-gold rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-700 mb-6">
                Our customer support team is here to help you 24/7
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+918415038275" className="btn-primary">
                  Call Us: +91 8415038275
                </a>
               <Link href="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
