import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization');

    const response = await fetch('http://127.0.0.1:5000/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Unauthorized' },
        { status: response.status }
      );
    }

    // Adapt backend response to frontend format
    // Backend returns: { data: { user: { name, email, ... } }, message: '...', success: true }
    // Frontend expects: { user: { id, name, email } }
    return NextResponse.json({
      user: data.data.user
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
