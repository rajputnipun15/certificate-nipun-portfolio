import { Certificate, UserProfile } from './types';
import { INITIAL_CERTIFICATES, INITIAL_USER_PROFILE } from './certificates-data';

// --- API Client Functions (Persistent Backend) ---

export const fetchCertificatesApi = async (): Promise<Certificate[]> => {
  try {
    const res = await fetch('/api/certificates', {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to fetch certificates');
    const data = await res.json();
    return data.certificates || INITIAL_CERTIFICATES;
  } catch (err) {
    console.warn('API fetch failed, returning initial certificates fallback', err);
    return INITIAL_CERTIFICATES;
  }
};

export const fetchCertificateByIdApi = async (id: string): Promise<Certificate | null> => {
  try {
    const res = await fetch(`/api/certificates/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.certificate || null;
  } catch (err) {
    console.warn('API single certificate fetch failed', err);
    return null;
  }
};

export const createCertificateApi = async (certData: Partial<Certificate>): Promise<Certificate> => {
  const res = await fetch('/api/certificates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certData),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to create certificate');
  }

  return data.certificate;
};

export const updateCertificateApi = async (
  id: string,
  updates: Partial<Certificate>
): Promise<Certificate> => {
  const res = await fetch(`/api/certificates/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update certificate');
  }

  return data.certificate;
};

export const deleteCertificateApi = async (id: string): Promise<boolean> => {
  const res = await fetch(`/api/certificates/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete certificate');
  }

  return true;
};

export const reorderCertificatesApi = async (certificates: Certificate[]): Promise<Certificate[]> => {
  const res = await fetch('/api/certificates/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ certificates }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to reorder certificates');
  }

  return data.certificates;
};

export const fetchProfileApi = async (): Promise<UserProfile> => {
  try {
    const res = await fetch('/api/profile', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    const data = await res.json();
    return data.profile || INITIAL_USER_PROFILE;
  } catch (err) {
    console.warn('API profile fetch failed', err);
    return INITIAL_USER_PROFILE;
  }
};

export const updateProfileApi = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update profile');
  }

  return data.profile;
};

export const uploadCertificateFileApi = async (
  file: File
): Promise<{ success: boolean; fileUrl: string; fileName: string; fileType: 'pdf' | 'image'; error?: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'File upload failed');
  }

  return data;
};

export const checkAdminAuthApi = async (): Promise<boolean> => {
  try {
    const res = await fetch('/api/auth/session', {
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.authenticated);
  } catch (err) {
    return false;
  }
};

export const loginAdminApi = async (
  passcode: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Invalid passcode' };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during login' };
  }
};

export const logoutAdminApi = async (): Promise<void> => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (err) {
    console.error('Logout error:', err);
  }
};

// --- Synchronous Fallback Helpers ---

export const getStoredCertificates = (): Certificate[] => {
  return INITIAL_CERTIFICATES;
};

export const saveCertificates = (_certificates: Certificate[]): void => {
  // No-op for client-side synchronous calls; API handlers are used instead
};

export const getStoredProfile = (): UserProfile => {
  return INITIAL_USER_PROFILE;
};

export const saveProfile = (_profile: UserProfile): void => {
  // No-op for client-side synchronous calls; API handlers are used instead
};

export const isAdminAuthenticated = (): boolean => {
  return false;
};

export const setAdminAuthenticated = (_auth: boolean): void => {
  // No-op; handled via HTTP-only cookie
};
