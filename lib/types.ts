export interface Certificate {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  thumbnailUrl?: string;
  organization: string;
  courseName: string;
  issueDate: string;
  completionDate?: string;
  credentialId: string;
  verificationLink?: string;
  category: 'AI & Machine Learning' | 'Web Development' | 'Cyber Security' | 'Data & Analytics' | 'Software Engineering' | 'UI/UX & Design';
  skills: string[];
  description: string;
  featured?: boolean;
  order?: number;
  createdAt: string;
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: SkillItem[];
}

export interface SkillItem {
  name: string;
  iconName?: string;
  level: 'Advanced' | 'Proficient' | 'Intermediate' | 'Mastering';
  experienceYears?: string;
  category: string;
  certificatesCount?: number;
  highlight?: boolean;
}

export interface UserProfile {
  name: string;
  title: string;
  roles: string[];
  bio: string;
  email: string;
  phone?: string;
  github: string;
  linkedin: string;
  instagram: string;
  driveFolderUrl: string;
  resumeUrl: string;
  stats: {
    totalCertificates: number;
    hoursLearned: number;
    skillsMastered: number;
    specializations: number;
  };
}

export interface MetadataExtractionResult {
  title?: string;
  courseName?: string;
  organization?: string;
  issueDate?: string;
  completionDate?: string;
  credentialId?: string;
  verificationLink?: string;
  skills?: string[];
  category?: Certificate['category'];
  confidenceScore: number;
}
