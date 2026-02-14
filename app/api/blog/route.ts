import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const category = searchParams.get('category');
    
    const query: Record<string, unknown> = {};
    if (published === 'true') query.published = true;
    if (category) query.categories = category;
    
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 });
    
       return NextResponse.json(posts);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch posts';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }}


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
    const post = await BlogPost.create(data);
    
    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to create post';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
