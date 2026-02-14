import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Car from '@/models/Car';
import { calculateDays } from '@/lib/utils';

/* =======================
   GET – Admin only
======================= */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const bookings = await Booking.find()
      .populate('carId')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch bookings',
      },
      { status: 500 }
    );
  }
}

/* =======================
   POST – Public
======================= */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const data = await request.json();

    // Validate car exists
    const car = await Car.findById(data.carId);
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    // Calculate total days
    const totalDays = calculateDays(
      new Date(data.pickupDate),
      new Date(data.returnDate)
    );

    if (totalDays <= 0) {
      return NextResponse.json(
        { error: 'Invalid booking dates' },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = totalDays * car.pricePerDay;

    // Create booking
    const booking = new Booking({
      ...data,
      totalDays,
      totalPrice,
      status: 'pending',
    });

    await booking.save();

   

    return NextResponse.json(booking, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create booking',
      },
      { status: 500 }
    );
  }
}
