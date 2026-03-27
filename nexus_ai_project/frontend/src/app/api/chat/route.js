import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { memStore } from '@/lib/demo-data';
import { generateChatResponse } from '@/lib/ai';

export async function POST(request) {
  try {
    await memStore.init();
    const decoded = getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, mode, chatId } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const twin = memStore.findTwin(decoded.userId);
    const chatMode = mode || 'advise';

    let chat;
    if (chatId) {
      chat = memStore.chats?.find(c => c._id === chatId);
      if (chat) {
        memStore.addChatMessage(chatId, { role: 'user', content: message });
      }
    }

    if (!chat) {
      chat = memStore.createChat({
        userId: decoded.userId,
        mode: chatMode,
        messages: [{ role: 'user', content: message, timestamp: new Date() }],
      });
    }

    const messages = chat.messages.map(m => ({ role: m.role, content: m.content }));
    const response = await generateChatResponse(messages, chatMode, twin);

    memStore.addChatMessage(chat._id, { role: 'assistant', content: response });

    return NextResponse.json({
      response,
      chatId: chat._id,
    });
  } catch (error) {
    console.error('Chat error:', error);
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

    const chats = memStore.findChats(decoded.userId);
    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
