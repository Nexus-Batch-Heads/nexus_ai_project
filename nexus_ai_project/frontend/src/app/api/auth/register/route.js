import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { memStore } from '@/lib/demo-data';

export async function POST(request) {
  try {
    await memStore.init();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = memStore.findUser({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = memStore.createUser({ name, email, password: hashedPassword });

    const token = signToken({ userId: user._id, email: user.email, name: user.name });

    return NextResponse.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
