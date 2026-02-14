import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Menu, { IMenu } from '@/models/Menu';
import { Types } from 'mongoose';

/* ----------------------------- */
/* Types */
/* ----------------------------- */

type MenuNode = Omit<IMenu, 'parentId'> & {
  _id: string;
  parentId: string | null;
  children: MenuNode[];
};

/* ----------------------------- */
/* GET /api/menus */
/* ----------------------------- */

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');

    const query: Record<string, unknown> = { isActive: true };

    if (location && location !== 'both') {
      query.$or = [{ location }, { location: 'both' }];
    }

    const menus = await Menu.find(query)
      .sort({ order: 1 })
      .lean();

    const menuMap = new Map<string, MenuNode>();
    const rootMenus: MenuNode[] = [];

    // First pass
    menus.forEach((menu) => {
      const node: MenuNode = {
        ...menu,
        _id: (menu._id as Types.ObjectId).toString(),
        parentId: menu.parentId
          ? (menu.parentId as Types.ObjectId).toString()
          : null,
        children: [],
      };

      menuMap.set(node._id, node);
    });

    // Second pass
    menuMap.forEach((node) => {
      if (node.parentId) {
        const parent = menuMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          rootMenus.push(node);
        }
      } else {
        rootMenus.push(node);
      }
    });

    return NextResponse.json(rootMenus, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching menus:', error);

    const message =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to fetch menus', message },
      { status: 500 }
    );
  }
}

/* ----------------------------- */
/* POST /api/menus */
/* ----------------------------- */

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      label,
      href,
      order,
      isActive,
      location,
      openInNewTab,
      parentId,
    } = body as {
      label?: string;
      href?: string;
      order?: number;
      isActive?: boolean;
      location?: 'header' | 'footer' | 'both';
      openInNewTab?: boolean;
      parentId?: string | null;
    };

    if (!label || !href) {
      return NextResponse.json(
        { error: 'Label and href are required' },
        { status: 400 }
      );
    }

    const newMenu = await Menu.create({
      label,
      href,
      order: order ?? 0,
      isActive: isActive ?? true,
      location: location ?? 'both',
      openInNewTab: openInNewTab ?? false,
      parentId: parentId ? new Types.ObjectId(parentId) : null,
    });

    return NextResponse.json(newMenu, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating menu:', error);

    const message =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to create menu', message },
      { status: 500 }
    );
  }
}
