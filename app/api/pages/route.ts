import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Post_Page';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/pages - Fetch all pages
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published');
    const slug = searchParams.get('slug');
    
    const query: Record<string, unknown> = {};

    if (published === 'true') query.isPublished = true;
    if (slug) query.slug = slug;

    const pages = await Page.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    if (slug) {
      const page = pages[0];
      if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      return NextResponse.json(page, { status: 200 });
    }

    return NextResponse.json(pages, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch pages';

    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages', message },
      { status: 500 }
    );
  }
}

// POST /api/pages - Create new page (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const {
      title,
      slug,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      metaKeywords,
      featuredImage,
      isPublished,
      author,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      );
    }

    const newPage = await Page.create({
      title,
      slug,
      content,
      excerpt,
      metaTitle: metaTitle ?? title,
      metaDescription: metaDescription ?? excerpt,
      metaKeywords,
      featuredImage,
      isPublished: isPublished ?? false,
      author: author ?? 'Admin',
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to create page';

    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page', message },
      { status: 500 }
    );
  }
}
