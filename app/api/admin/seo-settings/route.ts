// app/api/admin/seo-settings/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SEOSettings from '@/models/SEOSettings';
import { clearSEOCache } from '@/lib/seo';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await dbConnect();
    let settings = await SEOSettings.findOne().lean();
    
    if (!settings) {
      settings = await SEOSettings.create({
        siteName: 'Cloudhills in Shillong',
        siteDescription: 'Taxi & Premium Car Rental Service - Affordable & Luxury Cars',
        siteKeywords: 'car rental, taxi service, shillong, meghalaya',
        defaultOgImage: '/images/og-image.jpg',
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    let settings = await SEOSettings.findOne();
    
    if (!settings) {
      settings = await SEOSettings.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }
    
    // ✅ CRITICAL: Clear the SEO cache
    clearSEOCache();
    
    // ✅ Revalidate all important paths
    try {
      revalidatePath('/', 'layout'); // Revalidate root layout
      revalidatePath('/');
      revalidatePath('/cars');
      revalidatePath('/blog');
      revalidatePath('/about');
      revalidatePath('/contact');
      
      console.log('✅ SEO settings updated and cache cleared');
    } catch (revalidateError) {
      console.error('Error during revalidation:', revalidateError);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to save SEO settings' },
      { status: 500 }
    );
  }
}