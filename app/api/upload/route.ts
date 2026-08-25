import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { verifyAdminSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

export async function POST(req: NextRequest) {
  // Check Admin Authorization
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum limit of 25MB.' },
        { status: 400 }
      );
    }

    // Validate MIME type & extension
    const mimeType = file.type || 'application/octet-stream';
    const extension = path.extname(file.name).toLowerCase();
    const isValidType =
      ALLOWED_TYPES.includes(mimeType) ||
      ['.pdf', '.png', '.jpg', '.jpeg', '.webp'].includes(extension);

    if (!isValidType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file format. Only PDF, PNG, JPG, and WEBP are supported.',
        },
        { status: 400 }
      );
    }

    // Generate safe, unique filename for Supabase Storage
    const sanitizedBase = path
      .basename(file.name, extension)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFilename = `${Date.now()}_${sanitizedBase}${extension || '.pdf'}`;

    // Convert file to Buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload directly to Supabase Storage bucket 'certificates'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(uniqueFilename, buffer, {
        contentType: mimeType.startsWith('image/') ? mimeType : 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: `Supabase upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get permanent public URL from Supabase Storage
    const { data: urlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(uniqueFilename);

    const isPdf = extension === '.pdf' || mimeType === 'application/pdf';

    return NextResponse.json({
      success: true,
      fileUrl: urlData.publicUrl,
      fileName: file.name,
      fileType: isPdf ? 'pdf' : 'image',
      size: file.size,
      message: 'Certificate uploaded to Supabase Storage successfully.',
    });
  } catch (err: any) {
    console.error('Error uploading file to Supabase Storage:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to upload and store file.' },
      { status: 500 }
    );
  }
}
