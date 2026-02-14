import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

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
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const query: any = {};
    if (status) query.status = status;
    
    const subscribers = await Subscriber.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(subscribers);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: data.email });
    
    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Reactivate subscription
        existing.status = 'active';
        existing.subscribedAt = new Date();
        existing.unsubscribedAt = undefined;
        await existing.save();
        
        return NextResponse.json({ 
          message: 'Welcome back! Your subscription has been reactivated.',
          subscriber: existing 
        });
      }
      
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter.' },
        { status: 400 }
      );
    }
    
    const subscriber = await Subscriber.create(data);
    
    return NextResponse.json({ 
      message: 'Successfully subscribed to our newsletter!',
      subscriber 
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'This email is already subscribed.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
