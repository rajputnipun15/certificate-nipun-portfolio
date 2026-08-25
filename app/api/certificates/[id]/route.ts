import { NextRequest, NextResponse } from 'next/server';
import { getCertificateById, updateCertificate, deleteCertificate } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const certificate = await getCertificateById(id);

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (err) {
    console.error('Error fetching certificate by ID:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve certificate.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate Admin Session
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const updates = await req.json();

    if (updates.skills && typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const updated = await updateCertificate(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Certificate updated successfully.',
      certificate: updated,
    });
  } catch (err) {
    console.error('Error updating certificate:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update certificate.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate Admin Session
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const success = await deleteCertificate(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found or already deleted.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Certificate deleted permanently from repository.',
    });
  } catch (err) {
    console.error('Error deleting certificate:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete certificate.' },
      { status: 500 }
    );
  }
}
