import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { Types } from 'mongoose';

function isValidObjectId(id: string) {
  return Types.ObjectId.isValid(id);
}

/* ======================
   UPDATE BOOKING
====================== */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    await dbConnect();
    const data = await request.json();

    const booking = await Booking.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('carId');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

/* ======================
   DELETE BOOKING
====================== */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    await dbConnect();

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
