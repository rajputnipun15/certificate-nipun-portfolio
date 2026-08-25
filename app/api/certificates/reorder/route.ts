import { NextRequest, NextResponse } from 'next/server';
import { reorderCertificates } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { certificates } = body;

    if (!Array.isArray(certificates)) {
      return NextResponse.json(
        { success: false, error: 'Certificates array is required.' },
        { status: 400 }
      );
    }

    const reordered = await reorderCertificates(certificates);

    return NextResponse.json({
      success: true,
      message: 'Certificate order persisted successfully.',
      certificates: reordered,
    });
  } catch (err) {
    console.error('Error reordering certificates:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder certificates.' },
      { status: 500 }
    );
  }
}
