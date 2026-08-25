import { NextRequest, NextResponse } from 'next/server';
import { getProfile, updateProfile } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve profile.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const updates = await req.json();
    const updated = await updateProfile(updates);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updated,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
