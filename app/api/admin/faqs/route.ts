// app/api/faqs/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import mongoose from 'mongoose';
import FAQ from '@/models/FAQ';

export const dynamic = 'force-dynamic';

// MongoDB connection caching for serverless
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// GET /api/faqs
export async function GET() {
  await dbConnect();
  const faqs = await FAQ.find().sort({ order: 1 });
  return NextResponse.json(faqs);
}

// POST /api/faqs
export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const faq = await FAQ.create(data);
  return NextResponse.json(faq);
}

// PUT /api/faqs
export async function PUT(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const faq = await FAQ.findByIdAndUpdate(data._id, data, { new: true });
  return NextResponse.json(faq);
}

// DELETE /api/faqs
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { id } = await req.json();
  await FAQ.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
