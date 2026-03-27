import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { memStore } from '@/lib/demo-data';

export async function GET(request) {
  try {
    await memStore.init();
    const decoded = getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const twin = memStore.findTwin(decoded.userId);
    return NextResponse.json({ twin: twin || null });
  } catch (error) {
    console.error('Get twin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await memStore.init();
    const decoded = getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    let twin = memStore.findTwin(decoded.userId);
    
    if (twin) {
      twin = memStore.updateTwin(decoded.userId, data);
    } else {
      twin = memStore.createTwin({ userId: decoded.userId, ...data });
    }

    return NextResponse.json({ twin });
  } catch (error) {
    console.error('Twin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
