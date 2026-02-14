import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';

/* =========================
   GET – Public (list)
========================= */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const available = searchParams.get('available');

    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (available !== null) query.available = available === 'true';

    const cars = await Car.find(query).sort({ createdAt: -1 });
    return NextResponse.json(cars);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}

/* =========================
   POST – Admin only
========================= */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const data = await request.json();

    const car = await Car.create({
      ...data,
      carModel: data.model, // 🔥 FIX
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error('CREATE CAR ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to create car' },
      { status: 500 }
    );
  }
}
