'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface TourPage {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  author?: string;
  price?: number;
  days?: number;
  nights?: number;
  locations?: number;
  highlights?: string[];
  isPopular?: boolean;
  available?: boolean;
  rating?: number;
  totalReviews?: number;
  inclusions?: string[];
}

const WHATSAPP_NUMBER = '918415038275';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : star - 0.5 <= rating
              ? 'text-amber-400 fill-amber-200'
              : 'text-gray-300 fill-gray-200'
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function TabContent({ content, activeTab }: { content: string; activeTab: string }) {
  if (activeTab !== 'itinerary') return null;
  return (
    <div
      className="prose prose-lg max-w-none 
        prose-headings:font-bold prose-headings:text-slate-800
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-xl prose-h3:text-teal-700
        prose-p:text-slate-600 prose-p:leading-relaxed
        prose-li:text-slate-600
        prose-strong:text-slate-800
        prose-ul:space-y-1"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default function TourDetailPage({ page }: { page: TourPage }) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'highlights' | 'inclusions'>('itinerary');
  const [guests, setGuests] = useState(2);

  const totalPrice = (page.price || 0) * guests;
  const waMessage = encodeURIComponent(
    `Hi! I'm interested in booking the "${page.title}" tour.\n\n` +
    `Duration: ${page.days} Days / ${page.nights} Nights\n` +
    `Guests: ${guests}\n` +
    `Total: ₹${totalPrice.toLocaleString()}\n\n` +
    `Please share availability and booking details.`
  );

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: '📋' },
    { id: 'highlights', label: 'Highlights', icon: '✨' },
    { id: 'inclusions', label: "What's Included", icon: '🎒' },
  ] as const;

  return (
    <>
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {page.featuredImage ? (
          <img
            src={page.featuredImage}
            alt={page.title}
            className="absolute inset-0 w-full h-full object-cover scale-105"
            style={{ animation: 'heroZoom 12s ease-in-out infinite alternate' }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-slate-900" />
        )}

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />

        {/* Popular badge */}
        {page.isPopular && (
          <div className="absolute top-6 left-6 z-10 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl tracking-wide uppercase">
            ⭐ Most Popular
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 max-w-5xl">
          {/* Duration pills */}
          <div className="flex flex-wrap gap-3 mb-5">
            {page.days && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/20">
                🕐 {page.days} Days / {page.nights} Nights
              </span>
            )}
            {page.locations && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/20">
                📍 {page.locations} Locations
              </span>
            )}
            <span
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full ${
                page.available
                  ? 'bg-emerald-500/80 text-white'
                  : 'bg-red-500/80 text-white'
              }`}
            >
              {page.available ? '✓ Available' : '✗ Not Available'}
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)', fontFamily: "'Georgia', serif" }}
          >
            {page.title}
          </h1>

          {page.excerpt && (
            <p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-4">
              {page.excerpt}
            </p>
          )}

          {/* Rating */}
          {page.rating && page.rating > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={page.rating} />
              <span className="text-white font-bold text-lg">{page.rating}</span>
              {page.totalReviews && (
                <span className="text-white/70 text-sm">
                  ({page.totalReviews.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── MAIN LAYOUT ───────────────────────────────────────────────────── */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ─── LEFT COLUMN ─────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Quick Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { icon: '🌅', label: 'Duration', value: `${page.days}D / ${page.nights}N` },
                  { icon: '📍', label: 'Locations', value: `${page.locations || '—'} Places` },
                  { icon: '⭐', label: 'Rating', value: page.rating ? `${page.rating}/5.0` : '—' },
                  {
                    icon: '👥',
                    label: 'Availability',
                    value: page.available ? 'Open' : 'Full',
                    accent: page.available ? 'text-emerald-600' : 'text-red-500',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center"
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`font-bold text-slate-800 ${stat.accent || ''}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="flex border-b border-gray-100">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 px-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        activeTab === tab.id
                          ? 'bg-teal-600 text-white'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-teal-600'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-6 md:p-8">
                  {/* Itinerary Tab */}
                  {activeTab === 'itinerary' && (
                    <TabContent content={page.content} activeTab="itinerary" />
                  )}

                  {/* Highlights Tab */}
                  {activeTab === 'highlights' && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-6">
                        Tour Highlights
                      </h3>
                      {page.highlights && page.highlights.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {page.highlights.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl p-4"
                            >
                              <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="text-slate-700 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No highlights listed.</p>
                      )}
                    </div>
                  )}

                  {/* Inclusions Tab */}
                  {activeTab === 'inclusions' && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-6">
                        What&apos;s Included
                      </h3>
                      {page.inclusions && page.inclusions.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {page.inclusions.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4"
                            >
                              <svg
                                className="w-5 h-5 text-emerald-600 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-slate-700 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No inclusions listed.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Published Info */}
              {(page.author || page.publishedAt) && (
                <div className="text-sm text-gray-400 flex items-center gap-3 px-1">
                  {page.author && <span>Curated by <span className="text-gray-600 font-medium">{page.author}</span></span>}
                  {page.publishedAt && (
                    <>
                      <span>·</span>
                      <time dateTime={page.publishedAt}>
                        Updated{' '}
                        {new Date(page.publishedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ─── STICKY BOOKING SIDEBAR ──────────────────────────────────── */}
            <aside className="w-full lg:w-[360px] lg:sticky lg:top-24 flex-shrink-0">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Sidebar Header */}
                <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-6 py-5 text-white">
                  <div className="text-sm font-medium text-teal-100 mb-1">Starting from</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ₹{(page.price || 0).toLocaleString()}
                    </span>
                    <span className="text-teal-200 text-sm font-medium">/ person</span>
                  </div>
                  {page.available ? (
                    <div className="mt-3 flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      Slots Available
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-1.5 text-rose-300 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                      Currently Unavailable
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-5">
                  {/* Guest Count */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xl font-bold transition-colors"
                      >
                        −
                      </button>
                      <div className="flex-1 text-center font-bold text-lg text-slate-800">
                        {guests}
                      </div>
                      <button
                        onClick={() => setGuests((g) => Math.min(20, g + 1))}
                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xl font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>₹{(page.price || 0).toLocaleString()} × {guests} person{guests > 1 ? 's' : ''}</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-slate-800">
                      <span>Total</span>
                      <span className="text-teal-700 text-lg">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-2.5">
                    {[
                      { icon: '🗓️', label: `${page.days} Days / ${page.nights} Nights` },
                      { icon: '📍', label: `${page.locations || 0} Locations Covered` },
                      ...(page.inclusions?.slice(0, 3).map((inc) => ({ icon: '✅', label: inc })) || []),
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-center text-white text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                        page.available
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-lg hover:-translate-y-0.5'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.04 2C6.48 2 2 6.5 2 12.04c0 2.13.56 4.11 1.54 5.84L2 22l4.31-1.42a9.957 9.957 0 005.73 1.65C17.56 22.23 22 17.76 22 12.04 22 6.48 17.52 2 12.04 2zm0 18.05a8.014 8.014 0 01-4.36-1.27l-.31-.19-2.57.84.88-2.5-.21-.34A7.98 7.98 0 014.05 12c0-4.42 3.59-8.02 8-8.02 4.41 0 8 3.6 8 8.02 0 4.41-3.6 8-8 8zm3.71-5.89l-.44-2.09c-.06-.27-.31-.49-.59-.49l-1.66.03c-.28 0-.53.21-.58.49l-.22 1.25c-.06.34-.36.63-.7.72l-1.38.37c-.35.09-.57.45-.5.8l.28 1.31c.07.35.37.61.73.61h.01c3.05 0 5.53-2.48 5.53-5.53 0-.31-.25-.56-.56-.56z" />
                      </svg>
                      {page.available ? 'Book via WhatsApp' : 'Currently Unavailable'}
                    </a>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hi! I'd like to enquire about the "${page.title}" tour. Can you share more details?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-6 rounded-2xl font-bold text-center text-teal-700 border-2 border-teal-600 hover:bg-teal-50 transition-all duration-200 text-sm flex items-center justify-center gap-2"
                    >
                      💬 Ask a Question
                    </a>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    Free cancellation · No hidden charges
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: '🛡️', label: 'Verified Tours' },
                    { icon: '💯', label: 'Best Price' },
                    { icon: '🤝', label: '24/7 Support' },
                  ].map((badge) => (
                    <div key={badge.label}>
                      <div className="text-xl mb-1">{badge.icon}</div>
                      <div className="text-xs text-gray-500 font-medium">{badge.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center gap-3 z-40 shadow-2xl">
        <div className="flex-1">
          <div className="text-xs text-gray-400">Starting from</div>
          <div className="text-xl font-extrabold text-teal-700">
            ₹{(page.price || 0).toLocaleString()}
            <span className="text-xs text-gray-400 font-normal"> /person</span>
          </div>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-md"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.04 2C6.48 2 2 6.5 2 12.04c0 2.13.56 4.11 1.54 5.84L2 22l4.31-1.42a9.957 9.957 0 005.73 1.65C17.56 22.23 22 17.76 22 12.04 22 6.48 17.52 2 12.04 2zm0 18.05a8.014 8.014 0 01-4.36-1.27l-.31-.19-2.57.84.88-2.5-.21-.34A7.98 7.98 0 014.05 12c0-4.42 3.59-8.02 8-8.02 4.41 0 8 3.6 8 8.02 0 4.41-3.6 8-8 8zm3.71-5.89l-.44-2.09c-.06-.27-.31-.49-.59-.49l-1.66.03c-.28 0-.53.21-.58.49l-.22 1.25c-.06.34-.36.63-.7.72l-1.38.37c-.35.09-.57.45-.5.8l.28 1.31c.07.35.37.61.73.61h.01c3.05 0 5.53-2.48 5.53-5.53 0-.31-.25-.56-.56-.56z" />
          </svg>
          Book Now
        </a>
      </div>

      {/* WhatsApp floating button (desktop) */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg items-center justify-center z-50 transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2C6.48 2 2 6.5 2 12.04c0 2.13.56 4.11 1.54 5.84L2 22l4.31-1.42a9.957 9.957 0 005.73 1.65C17.56 22.23 22 17.76 22 12.04 22 6.48 17.52 2 12.04 2zm0 18.05a8.014 8.014 0 01-4.36-1.27l-.31-.19-2.57.84.88-2.5-.21-.34A7.98 7.98 0 014.05 12c0-4.42 3.59-8.02 8-8.02 4.41 0 8 3.6 8 8.02 0 4.41-3.6 8-8 8zm3.71-5.89l-.44-2.09c-.06-.27-.31-.49-.59-.49l-1.66.03c-.28 0-.53.21-.58.49l-.22 1.25c-.06.34-.36.63-.7.72l-1.38.37c-.35.09-.57.45-.5.8l.28 1.31c.07.35.37.61.73.61h.01c3.05 0 5.53-2.48 5.53-5.53 0-.31-.25-.56-.56-.56z" />
        </svg>
      </a>

      {/* Bottom padding so mobile bar doesn't overlap content */}
      <div className="lg:hidden h-24" />

      <Footer />

      <style jsx global>{`
        @keyframes heroZoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1.12); }
        }
      `}</style>
    </>
  );
}