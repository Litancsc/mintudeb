import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Post_Page';
import { Types } from 'mongoose';

// GET /api/pages/[id] - Get single page
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await the params to access the `id`

    // Validate if the `id` is a valid ObjectId (MongoDB)
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid page ID' }, { status: 400 });
    }

    await dbConnect();
    const page = await Page.findById(id);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page, { status: 200 });
  } catch (error) {
    console.log('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

// PUT /api/pages/[id] - Update page
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await the params to access the `id`
    const body = await req.json();

    await dbConnect();

    // If slug is being changed, check it doesn't conflict
    if (body.slug) {
      const existingPage = await Page.findOne({
        slug: body.slug,
        _id: { $ne: id },
      });
      if (existingPage) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const updatedPage = await Page.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPage, { status: 200 });
  } catch (error) {
    console.log('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

// DELETE /api/pages/[id] - Delete page
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await the params to access the `id`

    await dbConnect();

    const deletedPage = await Page.findByIdAndDelete(id);

    if (!deletedPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Page deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
