import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Menu from '@/models/Menu';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';

/* ---------------------------------- */
/* GET /api/menus/[id] */
/* ---------------------------------- */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid menu ID' },
        { status: 400 }
      );
    }

    const menu = await Menu.findById(id).lean();

    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menu, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching menu:', error);

    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

/* ---------------------------------- */
/* PUT /api/menus/[id] */
/* ---------------------------------- */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid menu ID' },
        { status: 400 }
      );
    }

    const data = await request.json();

    const updatedMenu = await Menu.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedMenu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedMenu, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating menu:', error);

    return NextResponse.json(
      { error: 'Failed to update menu' },
      { status: 500 }
    );
  }
}

/* ---------------------------------- */
/* DELETE /api/menus/[id] */
/* ---------------------------------- */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid menu ID' },
        { status: 400 }
      );
    }

    const menuToDelete = await Menu.findByIdAndDelete(id);

    if (!menuToDelete) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    // Optional: delete children recursively
    await Menu.deleteMany({ parentId: id });

    return NextResponse.json(
      { message: 'Menu and its children deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting menu:', error);

    return NextResponse.json(
      { error: 'Failed to delete menu' },
      { status: 500 }
    );
  }
}
