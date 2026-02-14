import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ServicePage from '@/models/ServicePage';

// GET - Fetch all service pages or filter by service/location
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const serviceSlug = searchParams.get('service');
    const locationSlug = searchParams.get('location');
    const published = searchParams.get('published');

    const query: {
      serviceSlug?: string;
      locationSlug?: string;
      isPublished?: boolean;
    } = {};

    if (serviceSlug) query.serviceSlug = serviceSlug;
    if (locationSlug) query.locationSlug = locationSlug;
    if (published === 'true') query.isPublished = true;

    const servicePages = await ServicePage.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(servicePages);
  } catch (error) {
    console.error('Error fetching service pages:', error);
    return NextResponse.json(
      { message: 'Error fetching service pages' },
      { status: 500 }
    );
  }
}

// POST - Create a new service page
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    if (!body.serviceSlug) {
      return NextResponse.json(
        { message: 'Service slug is required' },
        { status: 400 }
      );
    }

    if (!body.locationSlug) {
      return NextResponse.json(
        { message: 'Location slug is required' },
        { status: 400 }
      );
    }

    if (!body.title) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body.content) {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: 400 }
      );
    }

    // Check if service-location combination already exists
    const existing = await ServicePage.findOne({
      serviceSlug: body.serviceSlug.toLowerCase().trim(),
      locationSlug: body.locationSlug.toLowerCase().trim(),
    });

    if (existing) {
      return NextResponse.json(
        {
          message:
            'A page for this service-location combination already exists',
        },
        { status: 400 }
      );
    }

    // Create with trimmed and lowercase slugs
    const pageData = {
      ...body,
      serviceSlug: body.serviceSlug.toLowerCase().trim(),
      locationSlug: body.locationSlug.toLowerCase().trim(),
    };

    const servicePage = await ServicePage.create(pageData);

    return NextResponse.json(servicePage, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating service page:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Error creating service page',
      },
      { status: 500 }
    );
  }
}
