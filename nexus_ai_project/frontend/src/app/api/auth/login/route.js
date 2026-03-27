import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { memStore } from '@/lib/demo-data';

export async function POST(request) {
  try {
    await memStore.init();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = memStore.findUser({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ userId: user._id, email: user.email, name: user.name });

    return NextResponse.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
