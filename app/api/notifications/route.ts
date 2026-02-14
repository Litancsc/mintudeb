import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

// GET - Fetch notifications
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    const query: Record<string, unknown> = {};

    if (active === 'true') {
      const now = new Date();

      query.active = true;
      query.startDate = { $lte: now };
      query.$or = [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: now } },
      ];
    }

    const notifications = await Notification.find(query).sort({
      priority: -1,
      createdAt: -1,
    });

    return NextResponse.json(notifications);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// POST - Create notification ✅ FIX
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
    const notification = await Notification.create(data);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Server error';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
