import { Certificate, UserProfile } from './types';
import { INITIAL_CERTIFICATES, INITIAL_USER_PROFILE } from './certificates-data';

const STORAGE_KEYS = {
  CERTIFICATES: 'nipun_certificates_v1',
  PROFILE: 'nipun_user_profile_v1',
  ADMIN_AUTH: 'nipun_admin_auth_state'
};

export const getStoredCertificates = (): Certificate[] => {
  if (typeof window === 'undefined') return INITIAL_CERTIFICATES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
      return INITIAL_CERTIFICATES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading certificates from storage', err);
    return INITIAL_CERTIFICATES;
  }
};

export const saveCertificates = (certificates: Certificate[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
  } catch (err) {
    console.error('Error saving certificates to storage', err);
  }
};

export const getStoredProfile = (): UserProfile => {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILE;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      return INITIAL_USER_PROFILE;
    }
    return JSON.parse(data);
  } catch (err) {
    return INITIAL_USER_PROFILE;
  }
};

export const saveProfile = (profile: UserProfile): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving profile to storage', err);
  }
};

export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
};

export const setAdminAuthenticated = (auth: boolean): void => {
  if (typeof window === 'undefined') return;
  if (auth) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};
