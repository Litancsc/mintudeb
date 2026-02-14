import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ServicePage from '@/models/ServicePage';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Fetch a single service page by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await dbConnect();
    
    // Await params first (Next.js 15 requirement)
    const { id } = await params;

    const servicePage = await ServicePage.findById(id).lean();

    if (!servicePage) {
      return NextResponse.json(
        { message: 'Service page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(servicePage);
  } catch (error) {
    console.error('Error fetching service page:', error);
    return NextResponse.json(
      { message: 'Error fetching service page' },
      { status: 500 }
    );
  }
}

// PUT - Update a service page
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await dbConnect();
    
    // Await params first (Next.js 15 requirement)
    const { id } = await params;
    const body = await request.json();

    // Check if trying to update to an existing service-location combination
    if (body.serviceSlug && body.locationSlug) {
      const existing = await ServicePage.findOne({
        serviceSlug: body.serviceSlug.toLowerCase().trim(),
        locationSlug: body.locationSlug.toLowerCase().trim(),
        _id: { $ne: id }, // Now using awaited id
      });

      if (existing) {
        return NextResponse.json(
          { message: 'A page for this service-location combination already exists' },
          { status: 400 }
        );
      }
    }

    // Trim and lowercase slugs
    const updateData = {
      ...body,
      serviceSlug: body.serviceSlug?.toLowerCase().trim(),
      locationSlug: body.locationSlug?.toLowerCase().trim(),
    };

    const servicePage = await ServicePage.findByIdAndUpdate(
      id, // Now using awaited id
      updateData,
      { new: true, runValidators: true }
    );

    if (!servicePage) {
      return NextResponse.json(
        { message: 'Service page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(servicePage);
  } catch {
    console.error('Error updating service page:');
    return NextResponse.json(
      { message:'Error updating service page' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a service page
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await dbConnect();
    
    // Await params first (Next.js 15 requirement)
    const { id } = await params;

    const servicePage = await ServicePage.findByIdAndDelete(id); // Now using awaited id

    if (!servicePage) {
      return NextResponse.json(
        { message: 'Service page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Service page deleted successfully' });
  } catch (error) {
    console.error('Error deleting service page:', error);
    return NextResponse.json(
      { message: 'Error deleting service page' },
      { status: 500 }
    );
  }
}