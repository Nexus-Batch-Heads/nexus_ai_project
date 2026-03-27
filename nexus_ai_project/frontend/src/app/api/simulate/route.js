import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { memStore } from '@/lib/demo-data';
import { generateSimulation } from '@/lib/ai';

export async function POST(request) {
  try {
    await memStore.init();
    const decoded = getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { decision } = await request.json();
    if (!decision) {
      return NextResponse.json({ error: 'Decision text is required' }, { status: 400 });
    }

    const twin = memStore.findTwin(decoded.userId);
    const result = await generateSimulation(decision, twin);

    const simulation = memStore.createSimulation({
      userId: decoded.userId,
      decision,
      category: result.category || 'general',
      scenarios: result.scenarios,
      bestPath: result.bestPath,
      reasoning: result.reasoning,
    });

    return NextResponse.json({ simulation });
  } catch (error) {
    console.error('Simulate error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await memStore.init();
    const decoded = getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const simulations = memStore.findSimulations(decoded.userId);
    return NextResponse.json({ simulations });
  } catch (error) {
    console.error('Get simulations error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
