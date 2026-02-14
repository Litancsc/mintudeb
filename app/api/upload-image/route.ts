import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';




export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Prepare directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = path.extname(file.name);
    const fileName = `image-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert File → Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Return file URL
    const fileUrl = `/uploads/${fileName}`;
    console.log('✅ Uploaded:', fileUrl);
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Upload failed:', error);
    return NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 });
  }
}
