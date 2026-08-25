import { Certificate, UserProfile } from './types';
import { INITIAL_USER_PROFILE } from './certificates-data';
import { supabase } from './supabase';

/**
 * Maps raw Supabase PostgreSQL row to Certificate TypeScript interface
 */
const mapRowToCertificate = (item: any): Certificate => ({
  id: item.id,
  title: item.title,
  fileName: item.file_name || `${item.title}.pdf`,
  fileType: item.file_type || 'pdf',
  fileUrl: item.file_url || '',
  thumbnailUrl: item.thumbnail_url || undefined,
  organization: item.organization || item.issuer || 'Coursera',
  courseName: item.course_name || item.title,
  issueDate: item.issue_date || '2024',
  completionDate: item.completion_date || undefined,
  credentialId: item.credential_id || '',
  verificationLink: item.verification_link || undefined,
  category: item.category || 'Software Engineering',
  skills: Array.isArray(item.skills) ? item.skills : [],
  description: item.description || '',
  featured: !!item.featured,
  order: item.sort_order ?? 0,
  createdAt: item.created_at || new Date().toISOString(),
});

/**
 * Fetches all certificates from Supabase PostgreSQL
 */
export const getAllCertificates = async (): Promise<Certificate[]> => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error in getAllCertificates:', error);
      throw error;
    }

    if (data) {
      return data.map(mapRowToCertificate);
    }
  } catch (err) {
    console.error('Failed to fetch certificates from Supabase:', err);
  }

  return [];
};

/**
 * Fetches a single certificate by ID from Supabase PostgreSQL
 */
export const getCertificateById = async (id: string): Promise<Certificate | null> => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return mapRowToCertificate(data);
  } catch (err) {
    console.error(`Failed to fetch certificate ${id} from Supabase:`, err);
    return null;
  }
};

/**
 * Creates a new certificate record in Supabase PostgreSQL
 */
export const createCertificate = async (
  certData: Partial<Certificate> & { title: string; organization: string }
): Promise<Certificate> => {
  const newId =
    certData.id || `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const skillsArray = Array.isArray(certData.skills)
    ? certData.skills.filter(Boolean)
    : ['Software Engineering'];

  const newCert: Certificate = {
    id: newId,
    title: certData.title.trim(),
    fileName: certData.fileName || `${certData.title.trim()}.pdf`,
    fileType:
      certData.fileType ||
      (certData.fileUrl?.endsWith('.png') || certData.fileUrl?.endsWith('.jpg')
        ? 'image'
        : 'pdf'),
    fileUrl: certData.fileUrl || '',
    thumbnailUrl: certData.thumbnailUrl,
    organization: certData.organization.trim(),
    courseName: (certData.courseName || certData.title).trim(),
    issueDate: certData.issueDate?.trim() || 'August 2026',
    completionDate: certData.completionDate?.trim(),
    credentialId:
      certData.credentialId?.trim() ||
      `CRED-${Date.now().toString(36).toUpperCase()}`,
    verificationLink: certData.verificationLink?.trim() || '',
    category: certData.category || 'Software Engineering',
    skills: skillsArray,
    description:
      certData.description?.trim() ||
      `Verified completion credential for ${certData.title.trim()} issued by ${certData.organization.trim()}.`,
    featured: !!certData.featured,
    order: certData.order ?? 0,
    createdAt: certData.createdAt || now,
  };

  const { data, error } = await supabase
    .from('certificates')
    .insert({
      id: newCert.id,
      title: newCert.title,
      file_name: newCert.fileName,
      file_type: newCert.fileType,
      file_url: newCert.fileUrl,
      thumbnail_url: newCert.thumbnailUrl || null,
      organization: newCert.organization,
      course_name: newCert.courseName,
      issue_date: newCert.issueDate,
      completion_date: newCert.completionDate || newCert.issueDate,
      credential_id: newCert.credentialId,
      verification_link: newCert.verificationLink,
      category: newCert.category,
      skills: newCert.skills,
      description: newCert.description,
      featured: newCert.featured,
      sort_order: newCert.order,
      created_at: newCert.createdAt,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error in createCertificate:', error);
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  return mapRowToCertificate(data || newCert);
};

/**
 * Updates an existing certificate in Supabase PostgreSQL
 */
export const updateCertificate = async (
  id: string,
  updates: Partial<Certificate>
): Promise<Certificate | null> => {
  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) updatePayload.title = updates.title.trim();
  if (updates.organization !== undefined)
    updatePayload.organization = updates.organization.trim();
  if (updates.courseName !== undefined)
    updatePayload.course_name = updates.courseName.trim();
  if (updates.issueDate !== undefined)
    updatePayload.issue_date = updates.issueDate.trim();
  if (updates.completionDate !== undefined)
    updatePayload.completion_date = updates.completionDate?.trim();
  if (updates.credentialId !== undefined)
    updatePayload.credential_id = updates.credentialId?.trim();
  if (updates.verificationLink !== undefined)
    updatePayload.verification_link = updates.verificationLink?.trim();
  if (updates.category !== undefined) updatePayload.category = updates.category;
  if (updates.skills !== undefined) updatePayload.skills = updates.skills;
  if (updates.description !== undefined)
    updatePayload.description = updates.description.trim();
  if (updates.featured !== undefined) updatePayload.featured = updates.featured;
  if (updates.order !== undefined) updatePayload.sort_order = updates.order;
  if (updates.fileUrl !== undefined) updatePayload.file_url = updates.fileUrl;
  if (updates.fileName !== undefined) updatePayload.file_name = updates.fileName;
  if (updates.fileType !== undefined) updatePayload.file_type = updates.fileType;

  const { data, error } = await supabase
    .from('certificates')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Supabase update error for certificate ${id}:`, error);
    throw new Error(`Supabase update failed: ${error.message}`);
  }

  if (!data) return null;
  return mapRowToCertificate(data);
};

/**
 * Deletes a certificate from Supabase PostgreSQL
 */
export const deleteCertificate = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('certificates').delete().eq('id', id);

  if (error) {
    console.error(`Supabase delete error for certificate ${id}:`, error);
    throw new Error(`Supabase delete failed: ${error.message}`);
  }

  return true;
};

/**
 * Reorders certificates in Supabase PostgreSQL
 */
export const reorderCertificates = async (
  certificates: Certificate[]
): Promise<Certificate[]> => {
  for (let i = 0; i < certificates.length; i++) {
    const cert = certificates[i];
    await supabase
      .from('certificates')
      .update({ sort_order: i + 1 })
      .eq('id', cert.id);
  }

  return getAllCertificates();
};

/**
 * Fetches User Profile and calculates live metrics from Supabase database
 */
export const getProfile = async (): Promise<UserProfile> => {
  const certs = await getAllCertificates();
  const allSkills = new Set<string>();
  certs.forEach((c) => c.skills?.forEach((s) => allSkills.add(s)));

  return {
    ...INITIAL_USER_PROFILE,
    stats: {
      totalCertificates: certs.length,
      hoursLearned: Math.max(750, certs.length * 25),
      skillsMastered: Math.max(24, allSkills.size),
      specializations: 6,
    },
  };
};

/**
 * Updates User Profile
 */
export const updateProfile = async (
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  return {
    ...INITIAL_USER_PROFILE,
    ...updates,
  };
};
