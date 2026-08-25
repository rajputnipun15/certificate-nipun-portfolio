import { NextRequest, NextResponse } from 'next/server';
import { getAllCertificates, createCertificate } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const certificates = await getAllCertificates();
    return NextResponse.json({
      success: true,
      certificates,
    });
  } catch (err) {
    console.error('Error fetching certificates:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve certificates.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Validate Admin Session
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const {
      title,
      organization,
      courseName,
      issueDate,
      completionDate,
      credentialId,
      verificationLink,
      fileUrl,
      fileName,
      fileType,
      category,
      skills,
      description,
      featured,
    } = body;

    // Field Validations
    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Certificate Title is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!organization || typeof organization !== 'string' || organization.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Issued By / Organization is required.' },
        { status: 400 }
      );
    }

    if (verificationLink && typeof verificationLink === 'string' && verificationLink.trim() !== '') {
      try {
        new URL(verificationLink.trim());
      } catch (_) {
        return NextResponse.json(
          { success: false, error: 'Invalid Certificate Verification URL format.' },
          { status: 400 }
        );
      }
    }

    // Prepare skills array
    let skillsArray: string[] = [];
    if (Array.isArray(skills)) {
      skillsArray = skills.map((s) => String(s).trim()).filter((s) => s.length > 0);
    } else if (typeof skills === 'string') {
      skillsArray = skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    }
    if (skillsArray.length === 0) {
      skillsArray = ['Software Engineering'];
    }

    const newCertificate = await createCertificate({
      title: title.trim(),
      organization: organization.trim(),
      courseName: (courseName || title).trim(),
      issueDate: (issueDate || '2024').trim(),
      completionDate: completionDate?.trim() || issueDate?.trim(),
      credentialId: (credentialId || `ID-${Date.now().toString(36).toUpperCase()}`).trim(),
      verificationLink: verificationLink?.trim() || '',
      fileUrl: fileUrl?.trim() || '',
      fileName: fileName?.trim() || `${title.trim()}.pdf`,
      fileType: fileType || 'pdf',
      category: category || 'Software Engineering',
      skills: skillsArray,
      description: description?.trim() || `Verified certificate for ${title.trim()} issued by ${organization.trim()}.`,
      featured: Boolean(featured),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Certificate created and persisted successfully.',
        certificate: newCertificate,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating certificate:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create and persist certificate.' },
      { status: 500 }
    );
  }
}
