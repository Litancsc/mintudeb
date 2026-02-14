import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import { Types } from 'mongoose';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const isValidId = (id: string) => Types.ObjectId.isValid(id);

/* =======================
   GET
======================= */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  if (!isValidId(id)) {
    return NextResponse.json(
      { error: 'Invalid car ID' },
      { status: 400 }
    );
  }

  await dbConnect();
  const car = await Car.findById(id);

  if (!car) {
    return NextResponse.json(
      { error: 'Car not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(car);
}

/* =======================
   UPDATE
======================= */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  if (!isValidId(id)) {
    return NextResponse.json(
      { error: 'Invalid car ID' },
      { status: 400 }
    );
  }

  await dbConnect();
  const data = await request.json();

  const car = await Car.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!car) {
    return NextResponse.json(
      { error: 'Car not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(car);
}

/* =======================
   DELETE
======================= */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  if (!isValidId(id)) {
    return NextResponse.json(
      { error: 'Invalid car ID' },
      { status: 400 }
    );
  }

  await dbConnect();
  const deleted = await Car.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { error: 'Car not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: 'Car deleted successfully',
  });
}

