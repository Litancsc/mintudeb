// app/api/admin/revalidate/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearSEOCache } from '@/lib/seo';

export async function POST() {
  try {
    // Clear SEO cache
    clearSEOCache();
    
    // Revalidate root layout and all pages
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/cars', 'page');
    revalidatePath('/blog', 'page');
    revalidatePath('/about', 'page');
    revalidatePath('/contact', 'page');
    
    console.log('✅ All paths and layouts revalidated');
    
    return NextResponse.json({ 
      success: true,
      message: 'Cache cleared and pages revalidated',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}