import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

// GET /api/blog/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const post = await BlogPost.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession({
      req: request,
      ...authOptions,
    });

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const data: Partial<Record<string, unknown>> = await request.json();

    const post = await BlogPost.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession({
      req: request,
      ...authOptions,
    });

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Blog post deleted successfully',
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
