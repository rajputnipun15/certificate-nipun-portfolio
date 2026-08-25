import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPasscode, createAdminToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    if (!passcode) {
      return NextResponse.json({ success: false, error: 'Passcode is required.' }, { status: 400 });
    }

    if (!validateAdminPasscode(passcode)) {
      return NextResponse.json({ success: false, error: 'Invalid Passcode. Access Denied.' }, { status: 401 });
    }

    const token = createAdminToken();
    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully.',
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Error during admin login:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
