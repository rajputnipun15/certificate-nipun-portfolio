import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ehhvazggjgnoiuxikiqq.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaHZhemdnamdub2l1eGlraXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTgwNTEsImV4cCI6MjEwMTU3NDA1MX0.f_TSNh5teR8-lYz_C1qeWZOkz54RghwfrV2kvquVqfo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('Starting Supabase Cloud Seeding...');
  console.log('Connecting to:', SUPABASE_URL);

  const certificatesDir = path.join(rootDir, 'public', 'certificates');
  const files = fs.readdirSync(certificatesDir);
  console.log(`Found ${files.length} physical certificate files in ${certificatesDir}`);

  // 1. Upload each certificate file to Supabase Storage bucket 'certificates'
  const fileUrlMap = {};

  for (const file of files) {
    const filePath = path.join(certificatesDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const isPdf = file.toLowerCase().endsWith('.pdf');
    const contentType = isPdf ? 'application/pdf' : 'image/png';

    // Use URL-safe filename for Supabase Storage
    const safeStorageName = encodeURIComponent(file).replace(/%/g, '_');

    console.log(`Uploading ${file} -> ${safeStorageName}...`);
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(safeStorageName, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn(`Warning uploading ${file}:`, uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(safeStorageName);

    fileUrlMap[file] = publicUrlData.publicUrl;
    console.log(`✓ Uploaded: ${fileUrlMap[file]}`);
  }

  // 2. Read existing INITIAL_CERTIFICATES from certificates-data.ts
  const certsDataContent = fs.readFileSync(
    path.join(rootDir, 'lib', 'certificates-data.ts'),
    'utf-8'
  );

  // Parse INITIAL_CERTIFICATES array
  // We can dynamically evaluate the TypeScript/JS or parse it
  const match = certsDataContent.match(/export const INITIAL_CERTIFICATES: Certificate\[\] = (\[[\s\S]*?\]);\s*export const SKILL_CATEGORIES/);
  if (!match) {
    console.error('Could not extract INITIAL_CERTIFICATES from lib/certificates-data.ts');
    return;
  }

  const initialCertificates = eval(match[1]);
  console.log(`Extracted ${initialCertificates.length} certificates to seed into PostgreSQL.`);

  // 3. Insert records into Supabase PostgreSQL
  for (const cert of initialCertificates) {
    // Find permanent Supabase storage URL for this certificate's file
    let permanentFileUrl = cert.fileUrl;
    if (cert.fileName && fileUrlMap[cert.fileName]) {
      permanentFileUrl = fileUrlMap[cert.fileName];
    } else {
      // Find matching filename in map
      const foundKey = Object.keys(fileUrlMap).find((k) =>
        cert.fileName && k.toLowerCase() === cert.fileName.toLowerCase()
      );
      if (foundKey) {
        permanentFileUrl = fileUrlMap[foundKey];
      }
    }

    const row = {
      id: cert.id,
      title: cert.title,
      file_name: cert.fileName,
      file_type: cert.fileType || 'pdf',
      file_url: permanentFileUrl,
      thumbnail_url: cert.thumbnailUrl || null,
      organization: cert.organization,
      course_name: cert.courseName || cert.title,
      issue_date: cert.issueDate,
      completion_date: cert.completionDate || cert.issueDate,
      credential_id: cert.credentialId || '',
      verification_link: cert.verificationLink || '',
      category: cert.category,
      skills: cert.skills || [],
      description: cert.description || '',
      featured: !!cert.featured,
      sort_order: cert.order || 0,
      created_at: cert.createdAt || new Date().toISOString(),
    };

    console.log(`Upserting ${cert.id}: ${cert.title}...`);
    const { error: insertError } = await supabase
      .from('certificates')
      .upsert(row, { onConflict: 'id' });

    if (insertError) {
      console.error(`Error inserting ${cert.id}:`, insertError.message);
    } else {
      console.log(`✓ Seeded ${cert.id}`);
    }
  }

  // 4. Verify count in Supabase
  const { data: countData, count, error: countError } = await supabase
    .from('certificates')
    .select('*', { count: 'exact' });

  if (!countError) {
    console.log(`\n🎉 Success! Total certificates in Supabase: ${countData?.length}`);
  } else {
    console.error('Count check failed:', countError.message);
  }
}

main().catch(console.error);
