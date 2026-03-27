import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { memStore } from '@/lib/demo-data';

export async function POST(request) {
  try {
    await memStore.init();
    const decoded = getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, data } = await request.json();
    let twin = memStore.findTwin(decoded.userId);
    
    if (!twin) {
      twin = memStore.createTwin({ userId: decoded.userId, trainingLevel: 0 });
    }

    const updates = {};
    
    if (type === 'quiz') {
      updates.personalityTraits = data.personalityTraits;
      updates.riskTolerance = data.riskTolerance;
      updates.communicationStyle = data.communicationStyle;
      updates.decisionStyle = data.decisionStyle;
      updates.values = data.values;
      updates.tone = data.tone;
      updates.interests = data.interests;
      updates.quizCompleted = true;
      updates.trainingLevel = Math.min((twin.trainingLevel || 0) + 40, 100);
    } else if (type === 'chat') {
      updates.chatTrainingMessages = (twin.chatTrainingMessages || 0) + 1;
      updates.trainingLevel = Math.min((twin.trainingLevel || 0) + 2, 100);
    } else if (type === 'voice') {
      updates.trainingLevel = Math.min((twin.trainingLevel || 0) + 3, 100);
    }

    twin = memStore.updateTwin(decoded.userId, updates);
    return NextResponse.json({ twin });
  } catch (error) {
    console.error('Train error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
