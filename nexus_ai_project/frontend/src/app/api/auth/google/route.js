import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch('http://127.0.0.1:5000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Google Auth failed' },
        { status: response.status }
      );
    }

    // Adapt backend response to frontend format
    // Backend returns: { data: { access_token, user: { name, email } }, message: '...', success: true }
    // Frontend expects: { success: true, data: { access_token, user } }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Google Auth Route error:', error);
    return NextResponse.json({ error: 'Internal Server Error connecting to API' }, { status: 500 });
  }
}
