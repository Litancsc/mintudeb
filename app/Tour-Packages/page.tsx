import Link from 'next/link'
import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { FaStar, FaClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import Image from 'next/image'


/* =========================
   Type Definition
========================= */

interface Tour {
  _id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  price?: number
  days?: number
  nights?: number
  locations?: number
  highlights?: string[]
  isPopular?: boolean
  available?: boolean
  rating?: number
  totalReviews?: number
  inclusions?: string[]
}

/* =========================
   SEO Metadata
========================= */

export const metadata: Metadata = {
  title: 'Tour Packages | Your Travel Company',
  description:
    'Explore our best tour packages with pricing, itinerary details, and availability.',
  keywords: ['tour packages', 'travel tours', 'holiday packages'],
  openGraph: {
    title: 'Tour Packages | Your Travel Company',
    description:
      'Discover amazing travel experiences with our curated tour packages.',
    type: 'website',
  },
}

/* =========================
   Fetch Tours
========================= */

async function getTourPackages(): Promise<Tour[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const res = await fetch(
      `${baseUrl}/api/pages?published=true&type=tour`,
      { cache: 'no-store' }
    )

    if (!res.ok) return []

    const data: Tour[] = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching tour packages:', error)
    return []
  }
}

/* =========================
   Page Component
========================= */

export default async function TourPackagesPage() {
  const packages: Tour[] = await getTourPackages()

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Tour Packages
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing destinations with our carefully curated tour packages
            </p>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-600 text-lg">
                No tour packages available at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((tour: Tour) => (
                <div key={tour.slug} className="relative group">
                  {/* Popular Badge */}
                  {tour.isPopular && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                      Most Popular
                    </div>
                  )}

                  {/* Available Badge */}
                  <div className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg">
                    {tour.available ? (
                      <FaCheckCircle className="text-green-500 text-xl" title="Available" />
                    ) : (
                      <FaTimesCircle className="text-red-500 text-xl" title="Not Available" />
                    )}
                  </div>

                  <Link
                    href={`/${tour.slug}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group block transform hover:-translate-y-2"
                  >
                    {/* Image */}
                    {tour.featuredImage && (
                      <div className="h-64 overflow-hidden relative">
                        <Image
                          src={tour.featuredImage}
                          alt={tour.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {/* Title */}
                      <h2 className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {tour.title}
                      </h2>

                      {/* Excerpt */}
                      {tour.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {tour.excerpt}
                        </p>
                      )}

                      {/* Duration & Locations */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 py-2 border-y border-gray-200">
                        {(tour.days || tour.nights) && (
                          <div className="flex items-center gap-2">
                            <FaClock className="text-yellow-600" />
                            <span className="font-medium">
                              {tour.days || 0} Days {tour.nights || 0} Nights
                            </span>
                          </div>
                        )}
                        {tour.locations && (
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500" />
                            <span className="font-medium">{tour.locations} Locations</span>
                          </div>
                        )}
                      </div>

                      {/* Rating */}
                      {tour.rating && tour.rating > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-lg ${
                                  i < Math.floor(tour.rating || 0) 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-lg font-bold text-gray-800">
                            {tour.rating}
                          </span>
                          {tour.totalReviews && (
                            <span className="text-sm text-gray-500">
                              ({tour.totalReviews} reviews)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Highlights */}
                      {tour.highlights && tour.highlights.length > 0 && (
                        <ul className="space-y-2 pt-2">
                          {tour.highlights.slice(0, 3).map((highlight, index) => (
                            <li 
                              key={index} 
                              className="text-sm text-gray-700 flex items-start gap-2"
                            >
                              <span className="text-green-500 font-bold mt-0.5">✓</span>
                              <span className="line-clamp-1">{highlight}</span>
                            </li>
                          ))}
                          {tour.highlights.length > 3 && (
                            <li className="text-sm text-gray-500 font-medium italic pl-5">
                              +{tour.highlights.length - 3} more highlights
                            </li>
                          )}
                        </ul>
                      )}

                      {/* Inclusions Preview */}
                      {tour.inclusions && tour.inclusions.length > 0 && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            {tour.inclusions.slice(0, 2).map((inc, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium"
                              >
                                ✓ {inc}
                              </span>
                            ))}
                            {tour.inclusions.length > 2 && (
                              <span className="text-xs text-gray-500 px-2 py-1 italic">
                                +{tour.inclusions.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                        <div>
                          {tour.price !== undefined && tour.price > 0 ? (
                            <div className="flex flex-col">
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-yellow-600">
                                  ₹{tour.price.toLocaleString()}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">per person</span>
                            </div>
                          ) : (
                            <span className="text-lg text-gray-500 font-medium">
                              Contact for pricing
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg group-hover:from-yellow-600 group-hover:to-yellow-700 transition-all shadow-md hover:shadow-lg">
                            View Details
                          </span>
                        </div>
                      </div>

                      {/* Availability Status */}
                      <div className="pt-2">
                        {tour.available ? (
                          <span className="inline-flex items-center gap-1 text-sm text-green-600 font-semibold">
                            <FaCheckCircle /> Available Now
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm text-red-600 font-semibold">
                            <FaTimesCircle /> Currently Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* JSON-LD Schema for SEO */}
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'TouristTrip',
                        name: tour.title,
                        description: tour.excerpt || tour.title,
                        image: tour.featuredImage,
                        offers: {
                          '@type': 'Offer',
                          price: tour.price || 0,
                          priceCurrency: 'INR',
                          availability: tour.available
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
                        },
                        ...(tour.rating && {
                          aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: tour.rating,
                            reviewCount: tour.totalReviews || 0,
                            bestRating: 5,
                            worstRating: 1,
                          },
                        }),
                        itinerary: {
                          '@type': 'ItemList',
                          numberOfItems: tour.days || 0,
                          ...(tour.highlights && {
                            itemListElement: tour.highlights.slice(0, 5).map((highlight, index) => ({
                              '@type': 'ListItem',
                              position: index + 1,
                              name: highlight,
                            })),
                          }),
                        },
                        ...(tour.locations && {
                          touristType: 'Multi-destination',
                        }),
                      }),
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}