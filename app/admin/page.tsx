'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Star,
  ArrowUp,
  ArrowDown,
  Folder,
  Check,
  X,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Link as LinkIcon,
  ExternalLink,
  Tag,
  Calendar,
  Building,
  FileText,
  FileCheck,
  Award
} from 'lucide-react';
import {
  fetchCertificatesApi,
  createCertificateApi,
  updateCertificateApi,
  deleteCertificateApi,
  reorderCertificatesApi,
  fetchProfileApi,
  updateProfileApi,
  uploadCertificateFileApi,
  checkAdminAuthApi,
  loginAdminApi,
  logoutAdminApi,
} from '@/lib/storage';
import { extractMetadataFromFile } from '@/lib/pdf-parser';
import { Certificate, UserProfile } from '@/lib/types';
import GlassCard from '@/components/ui/GlassCard';
import Toast from '@/components/ui/Toast';

const CATEGORIES: Certificate['category'][] = [
  'AI & Machine Learning',
  'Web Development',
  'Cyber Security',
  'Data & Analytics',
  'Software Engineering',
  'UI/UX & Design',
];

const POPULAR_SKILL_SUGGESTIONS = [
  'React',
  'Next.js',
  'Node.js',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'MongoDB',
  'SQL',
  'Tailwind CSS',
  'Artificial Intelligence',
  'Cyber Security',
  'Git',
  'Docker',
  'AWS',
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Drawer states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [deleteConfirmCert, setDeleteConfirmCert] = useState<Certificate | null>(null);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<Partial<Certificate>>({});
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New Certificate Form State
  const [newCert, setNewCert] = useState<{
    title: string;
    organization: string;
    courseName: string;
    issueDate: string;
    verificationLink: string;
    category: Certificate['category'];
    skills: string[];
    description: string;
    credentialId: string;
    fileUrl: string;
    fileName: string;
    fileType: 'pdf' | 'image';
    featured: boolean;
  }>({
    title: '',
    organization: '',
    courseName: '',
    issueDate: 'August 2026',
    verificationLink: '',
    category: 'Software Engineering',
    skills: ['Software Engineering'],
    description: '',
    credentialId: '',
    fileUrl: '',
    fileName: '',
    fileType: 'pdf',
    featured: false,
  });

  // Dynamic Skill input state
  const [skillInput, setSkillInput] = useState('');
  const [editSkillInput, setEditSkillInput] = useState('');

  // Drive URL state
  const [driveUrl, setDriveUrl] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const displayToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [certs, prof] = await Promise.all([
        fetchCertificatesApi(),
        fetchProfileApi(),
      ]);
      setCertificates(certs);
      setProfile(prof);
      if (prof?.driveFolderUrl) {
        setDriveUrl(prof.driveFolderUrl);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      displayToast('Failed to load certificates from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthed = await checkAdminAuthApi();
      setAuthenticated(isAuthed);
      if (isAuthed) {
        await loadData();
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      displayToast('Please enter the admin passcode.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const result = await loginAdminApi(passcode);
      if (result.success) {
        setAuthenticated(true);
        setPasscode('');
        displayToast('Successfully authenticated as Administrator.');
        await loadData();
      } else {
        displayToast(result.error || 'Invalid passcode. Access denied.');
      }
    } catch (err: any) {
      displayToast('Login error: ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdminApi();
    setAuthenticated(false);
    displayToast('Admin dashboard locked.');
  };

  // --- Skill Chip Handlers ---
  const handleAddSkill = (skillToAdd: string, isEditing = false) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;

    if (isEditing && editingCert) {
      if (!editingCert.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
        setEditingCert({
          ...editingCert,
          skills: [...editingCert.skills, trimmed],
        });
      }
      setEditSkillInput('');
    } else {
      if (!newCert.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
        setNewCert({
          ...newCert,
          skills: [...newCert.skills, trimmed],
        });
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string, isEditing = false) => {
    if (isEditing && editingCert) {
      setEditingCert({
        ...editingCert,
        skills: editingCert.skills.filter((s) => s !== skillToRemove),
      });
    } else {
      setNewCert({
        ...newCert,
        skills: newCert.skills.filter((s) => s !== skillToRemove),
      });
    }
  };

  // --- File Upload Handler ---
  const handleFileUploadForNewCert = async (file: File) => {
    setIsProcessingUpload(true);
    try {
      const uploaded = await uploadCertificateFileApi(file);
      setNewCert((prev) => ({
        ...prev,
        fileUrl: uploaded.fileUrl,
        fileName: uploaded.fileName,
        fileType: uploaded.fileType,
      }));
      displayToast('Certificate file uploaded persistently.');
    } catch (err: any) {
      displayToast('File upload failed: ' + err.message);
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // --- Manual Add Certificate Submit ---
  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title.trim()) {
      displayToast('Certificate title is required.');
      return;
    }
    if (!newCert.organization.trim()) {
      displayToast('Issuer / Organization is required.');
      return;
    }
    if (!newCert.fileUrl && !newCert.verificationLink) {
      displayToast('Please provide either a certificate file upload or a verification link.');
      return;
    }

    setIsSaving(true);
    try {
      const created = await createCertificateApi({
        title: newCert.title,
        organization: newCert.organization,
        courseName: newCert.courseName || newCert.title,
        issueDate: newCert.issueDate || 'August 2026',
        verificationLink: newCert.verificationLink,
        category: newCert.category,
        skills: newCert.skills.length > 0 ? newCert.skills : ['Software Engineering'],
        description:
          newCert.description ||
          `Verified completion certificate for ${newCert.title} issued by ${newCert.organization}.`,
        credentialId: newCert.credentialId || `ID-${Date.now().toString(36).toUpperCase()}`,
        fileUrl: newCert.fileUrl,
        fileName: newCert.fileName || `${newCert.title}.pdf`,
        fileType: newCert.fileType,
        featured: newCert.featured,
        order: certificates.length + 1,
      });

      setCertificates([created, ...certificates]);
      setAddModalOpen(false);
      // Reset form
      setNewCert({
        title: '',
        organization: '',
        courseName: '',
        issueDate: 'August 2026',
        verificationLink: '',
        category: 'Software Engineering',
        skills: ['Software Engineering'],
        description: '',
        credentialId: '',
        fileUrl: '',
        fileName: '',
        fileType: 'pdf',
        featured: false,
      });
      displayToast('New certificate created and persisted to database!');
    } catch (err: any) {
      displayToast('Error creating certificate: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Upload Drawer & Auto-Extraction Logic ---
  const handleFileDrop = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setUploadFiles(fileArray);
    if (fileArray.length > 0) {
      setIsProcessingUpload(true);
      try {
        const firstFile = fileArray[0];
        const extracted = await extractMetadataFromFile(firstFile);

        setExtractedData({
          title: extracted.title || '',
          courseName: extracted.courseName || '',
          organization: extracted.organization || 'Coursera',
          issueDate: extracted.issueDate || 'August 2026',
          completionDate: extracted.completionDate || 'August 2026',
          credentialId: extracted.credentialId || `CRED-${Date.now()}`,
          verificationLink: extracted.verificationLink || '',
          category: extracted.category || 'Software Engineering',
          skills: extracted.skills || ['Software Engineering'],
          description: `Verified completion certificate for ${extracted.title} issued by ${extracted.organization}.`,
          featured: false,
        });
      } catch (err) {
        console.error('Extraction error:', err);
      } finally {
        setIsProcessingUpload(false);
      }
    }
  };

  const handleSaveUploadedCert = async () => {
    if (!uploadFiles.length || !extractedData.title) return;

    setIsSaving(true);
    try {
      const newAddedCerts: Certificate[] = [];

      for (let idx = 0; idx < uploadFiles.length; idx++) {
        const file = uploadFiles[idx];
        // Upload persistently to backend
        const uploadRes = await uploadCertificateFileApi(file);

        const created = await createCertificateApi({
          title: idx === 0 ? (extractedData.title as string) : file.name.replace(/\.[^/.]+$/, ''),
          fileName: uploadRes.fileName,
          fileType: uploadRes.fileType,
          fileUrl: uploadRes.fileUrl,
          organization: (extractedData.organization as string) || 'Coursera',
          courseName: (extractedData.courseName as string) || extractedData.title || file.name,
          issueDate: (extractedData.issueDate as string) || 'August 2026',
          completionDate: (extractedData.completionDate as string) || 'August 2026',
          credentialId: (extractedData.credentialId as string) || `ID-${Date.now()}-${idx}`,
          verificationLink: (extractedData.verificationLink as string) || '',
          category: (extractedData.category as Certificate['category']) || 'Software Engineering',
          skills: (extractedData.skills as string[]) || ['Software Engineering'],
          description:
            (extractedData.description as string) || `Verified certificate uploaded for ${file.name}.`,
          featured: !!extractedData.featured,
          order: certificates.length + idx + 1,
        });

        newAddedCerts.push(created);
      }

      setCertificates([...newAddedCerts, ...certificates]);
      setUploadDrawerOpen(false);
      setUploadFiles([]);
      setExtractedData({});
      displayToast(`Successfully saved and persisted ${uploadFiles.length} certificate(s)!`);
    } catch (err: any) {
      displayToast('Failed to save certificate: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Toggle Featured ---
  const handleToggleFeatured = async (id: string) => {
    const cert = certificates.find((c) => c.id === id);
    if (!cert) return;

    try {
      const updated = await updateCertificateApi(id, { featured: !cert.featured });
      setCertificates(certificates.map((c) => (c.id === id ? updated : c)));
      displayToast(`Featured status ${updated.featured ? 'enabled' : 'disabled'}.`);
    } catch (err: any) {
      displayToast('Failed to update featured status: ' + err.message);
    }
  };

  // --- Delete Certificate ---
  const handleDeleteCert = async () => {
    if (!deleteConfirmCert) return;

    try {
      await deleteCertificateApi(deleteConfirmCert.id);
      setCertificates(certificates.filter((c) => c.id !== deleteConfirmCert.id));
      displayToast('Certificate permanently deleted from database.');
      setDeleteConfirmCert(null);
    } catch (err: any) {
      displayToast('Delete failed: ' + err.message);
    }
  };

  // --- Reorder Certificate ---
  const handleMoveCert = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === certificates.length - 1)
    )
      return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...certificates];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setCertificates(updated);
    try {
      await reorderCertificatesApi(updated);
    } catch (err: any) {
      displayToast('Reorder failed to persist: ' + err.message);
    }
  };

  // --- Edit Certificate Save ---
  const handleSaveEditedCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    setIsSaving(true);
    try {
      const updated = await updateCertificateApi(editingCert.id, editingCert);
      setCertificates(certificates.map((c) => (c.id === editingCert.id ? updated : c)));
      setEditingCert(null);
      displayToast('Certificate details updated and persisted!');
    } catch (err: any) {
      displayToast('Update failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Google Drive Link Save ---
  const handleSaveDriveUrl = async () => {
    if (!profile) return;
    try {
      const updatedProf = await updateProfileApi({ driveFolderUrl: driveUrl });
      setProfile(updatedProf);
      displayToast('Google Drive Collection URL persisted!');
    } catch (err: any) {
      displayToast('Failed to save Drive URL: ' + err.message);
    }
  };

  // Render Login Lock Screen if not authenticated
  if (authenticated === null || authenticated === false) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <Toast message={toastMessage} isOpen={showToast} onClose={() => setShowToast(false)} />
        <GlassCard className="p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface border border-white/10 text-accent flex items-center justify-center mx-auto shadow-glow-accent">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif font-bold text-2xl text-white">Admin Authentication</h1>
            <p className="text-xs text-secondary font-mono">
              Restricted management console for Nipun Kumar Kushwah
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter Admin Passcode..."
              disabled={isLoggingIn}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white text-center font-mono text-sm focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-accent text-black font-bold text-xs uppercase tracking-wider shadow-glow-accent hover:bg-accent-light transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <span>Unlock Dashboard</span>
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-10">
      <Toast message={toastMessage} isOpen={showToast} onClose={() => setShowToast(false)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-2">
            <Unlock className="w-3.5 h-3.5" />
            <span>AUTHENTICATED ADMIN MODE (PERSISTENT DB)</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-white">
            Certificate Management Console
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-accent hover:bg-accent-light text-black font-semibold text-xs flex items-center gap-2 shadow-glow-accent transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
          </button>

          <button
            onClick={() => setUploadDrawerOpen(true)}
            className="px-5 py-3 rounded-xl bg-card hover:bg-surface border border-white/10 hover:border-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4 text-accent" />
            <span>Upload & Auto-Extract</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl bg-card border border-white/10 text-secondary hover:text-white text-xs font-mono transition-all"
          >
            Lock Dashboard
          </button>
        </div>
      </div>

      {/* Settings Panel: Google Drive URL Configuration */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="font-sans font-bold text-white text-lg flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-accent" />
          <span>Google Drive Collection URL</span>
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="url"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            className="flex-1 w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleSaveDriveUrl}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-card hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all"
          >
            Save Drive Link
          </button>
        </div>
      </GlassCard>

      {/* Certificates Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-sans font-bold text-white text-xl">
            Live Database Repository ({certificates.length} items)
          </h3>
          <span className="text-xs font-mono text-secondary">
            Changes persist permanently and reflect instantly across all browsers
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-secondary font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-accent mb-2" />
            <span>Loading persisted certificates...</span>
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-white/10 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface border-b border-white/10 text-secondary font-mono">
                  <th className="p-4">Order</th>
                  <th className="p-4">Title & Organization</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Credential ID</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {certificates.map((cert, index) => (
                  <tr key={cert.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-mono text-secondary/60">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveCert(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:text-white disabled:opacity-20 transition-opacity"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveCert(index, 'down')}
                          disabled={index === certificates.length - 1}
                          className="p-1 hover:text-white disabled:opacity-20 transition-opacity"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <span>#{index + 1}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white block line-clamp-1">{cert.title}</span>
                      <span className="text-[11px] font-mono text-secondary">{cert.organization}</span>
                    </td>
                    <td className="p-4 font-mono text-secondary">{cert.category}</td>
                    <td className="p-4 font-mono text-secondary/80">{cert.issueDate}</td>
                    <td className="p-4 font-mono text-accent">{cert.credentialId}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(cert.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          cert.featured
                            ? 'bg-accent/20 border-accent text-accent'
                            : 'bg-surface border-white/10 text-secondary hover:text-white'
                        }`}
                        title={cert.featured ? 'Featured on Homepage' : 'Not Featured'}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingCert(cert)}
                          className="p-2 rounded-lg bg-surface border border-white/10 text-secondary hover:text-white transition-colors"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmCert(cert)}
                          className="p-2 rounded-lg bg-surface border border-white/10 text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Certificate Form */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-surface border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-serif font-bold text-white text-xl flex items-center gap-2">
                  <Plus className="w-5 h-5 text-accent" />
                  <span>Add New Certificate to Database</span>
                </h3>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="p-2 rounded-xl bg-card text-secondary hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCertificate} className="space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-secondary uppercase">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Web Development"
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Organization and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary uppercase">
                      Issued By / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coursera / IBM / Meta"
                      value={newCert.organization}
                      onChange={(e) => setNewCert({ ...newCert, organization: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary uppercase">
                      Category *
                    </label>
                    <select
                      value={newCert.category}
                      onChange={(e) =>
                        setNewCert({ ...newCert, category: e.target.value as Certificate['category'] })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs focus:outline-none focus:border-accent cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-surface text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Issue Date and Credential ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary uppercase">
                      Certificate Date *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. August 2026 or 2024-04-15"
                      value={newCert.issueDate}
                      onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs focus:outline-none focus:border-accent font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary uppercase">
                      Credential ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2ZJXQ9S7VP9D"
                      value={newCert.credentialId}
                      onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs focus:outline-none focus:border-accent font-mono"
                    />
                  </div>
                </div>

                {/* Verification Link */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-secondary uppercase">
                    Certificate Verification URL (Optional if PDF is uploaded)
                  </label>
                  <input
                    type="url"
                    placeholder="https://coursera.org/verify/..."
                    value={newCert.verificationLink}
                    onChange={(e) => setNewCert({ ...newCert, verificationLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs focus:outline-none focus:border-accent font-mono"
                  />
                </div>

                {/* Certificate PDF/Image Upload */}
                <div className="space-y-2 p-4 rounded-xl bg-card/60 border border-white/10">
                  <label className="text-[10px] font-mono text-secondary uppercase block">
                    Certificate File (PDF or Image)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      id="new-cert-file-input"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUploadForNewCert(e.target.files[0]);
                        }
                      }}
                    />
                    <label
                      htmlFor="new-cert-file-input"
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer flex items-center justify-center gap-2 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-accent" />
                      <span>Choose PDF / Image</span>
                    </label>

                    {isProcessingUpload && (
                      <span className="text-xs text-accent font-mono flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Uploading persistently...</span>
                      </span>
                    )}

                    {newCert.fileUrl && !isProcessingUpload && (
                      <span className="text-xs text-accent font-mono flex items-center gap-1.5 line-clamp-1">
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-white/80">{newCert.fileName || 'File Attached'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills / Technologies (Interactive Tag/Chip input) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-secondary uppercase flex items-center gap-1">
                    <Tag className="w-3 h-3 text-accent" />
                    <span>Skills / Languages / Technologies Learned</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type skill (e.g. React, Python, SQL) and press Enter or Add..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(skillInput);
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-card border border-white/10 text-white text-xs focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill(skillInput)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {/* Suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-mono text-secondary/60 mr-1 self-center">Suggestions:</span>
                    {POPULAR_SKILL_SUGGESTIONS.slice(0, 8).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-secondary hover:text-white font-mono transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>

                  {/* Active Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {newCert.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/30 text-accent text-xs font-mono"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-secondary uppercase">
                    Certificate Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what you learned or what the certification covered..."
                    value={newCert.description}
                    onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-card border border-white/10 text-white text-xs resize-none focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Featured checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="new-cert-featured"
                    checked={newCert.featured}
                    onChange={(e) => setNewCert({ ...newCert, featured: e.target.checked })}
                    className="rounded bg-card border-white/20 text-accent focus:ring-accent"
                  />
                  <label htmlFor="new-cert-featured" className="text-xs text-secondary font-mono cursor-pointer">
                    Highlight as Featured Certificate on Homepage
                  </label>
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3.5 rounded-xl bg-accent text-black font-bold text-xs shadow-glow-accent uppercase tracking-wider hover:bg-accent-light transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <span>Save & Persist Certificate</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-6 py-3.5 rounded-xl bg-card text-secondary hover:text-white text-xs font-mono"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Upload & Auto Extract Drawer */}
      <AnimatePresence>
        {uploadDrawerOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-surface border border-white/15 rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-serif font-bold text-white text-xl flex items-center gap-2">
                  <Upload className="w-5 h-5 text-accent" />
                  <span>Upload & Auto-Extract Metadata</span>
                </h3>
                <button
                  onClick={() => setUploadDrawerOpen(false)}
                  className="p-2 rounded-xl bg-card text-secondary hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drag Drop Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) handleFileDrop(e.dataTransfer.files);
                }}
                className="p-8 border-2 border-dashed border-white/20 hover:border-accent rounded-2xl bg-card/60 text-center space-y-3 cursor-pointer transition-colors"
              >
                <Upload className="w-10 h-10 text-accent mx-auto animate-bounce" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Drag & Drop Certificate PDF or Images here
                  </p>
                  <p className="text-xs text-secondary font-mono mt-1">
                    Persistent server storage supported (.pdf, .png, .jpg)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  onChange={(e) => e.target.files && handleFileDrop(e.target.files)}
                  className="hidden"
                  id="admin-file-upload-drawer"
                />
                <label
                  htmlFor="admin-file-upload-drawer"
                  className="inline-block px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
                >
                  Choose Files
                </label>
              </div>

              {/* Auto Extraction Feedback & Editable Form */}
              {isProcessingUpload && (
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-mono flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting certificate metadata and processing file...</span>
                </div>
              )}

              {uploadFiles.length > 0 && !isProcessingUpload && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Extracted Information (Editable before publishing)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-mono text-secondary">TITLE</label>
                      <input
                        type="text"
                        value={extractedData.title || ''}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-secondary">ORGANIZATION</label>
                      <input
                        type="text"
                        value={extractedData.organization || ''}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, organization: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-secondary">CREDENTIAL ID</label>
                      <input
                        type="text"
                        value={extractedData.credentialId || ''}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, credentialId: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveUploadedCert}
                    disabled={isSaving}
                    className="w-full py-3.5 rounded-xl bg-accent text-black font-bold text-xs shadow-glow-accent uppercase tracking-wider hover:bg-accent-light transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Publishing to Persistent Database...</span>
                      </>
                    ) : (
                      <span>Publish Certificate(s) to Database</span>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Edit Certificate Details */}
      <AnimatePresence>
        {editingCert && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-surface border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-serif font-bold text-white text-xl flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-accent" />
                  <span>Edit Certificate Metadata</span>
                </h3>
                <button
                  onClick={() => setEditingCert(null)}
                  className="p-2 rounded-xl bg-card text-secondary hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedCert} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-secondary">CERTIFICATE TITLE *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.title}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary">ORGANIZATION *</label>
                    <input
                      type="text"
                      required
                      value={editingCert.organization}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, organization: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary">CATEGORY *</label>
                    <select
                      value={editingCert.category}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          category: e.target.value as Certificate['category'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-surface text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary">ISSUE DATE</label>
                    <input
                      type="text"
                      value={editingCert.issueDate}
                      onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary">CREDENTIAL ID</label>
                    <input
                      type="text"
                      value={editingCert.credentialId}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, credentialId: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-secondary">VERIFICATION LINK</label>
                  <input
                    type="url"
                    value={editingCert.verificationLink || ''}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, verificationLink: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                {/* Skills Chips */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-secondary flex items-center gap-1">
                    <Tag className="w-3 h-3 text-accent" />
                    <span>SKILLS & TECHNOLOGIES</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add skill..."
                      value={editSkillInput}
                      onChange={(e) => setEditSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(editSkillInput, true);
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill(editSkillInput, true)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editingCert.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/30 text-accent text-xs font-mono"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s, true)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-secondary">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editingCert.description}
                    onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-card border border-white/10 text-white text-xs resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3.5 rounded-xl bg-accent text-black font-bold text-xs shadow-glow-accent uppercase hover:bg-accent-light transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-5 py-3.5 rounded-xl bg-card text-secondary hover:text-white text-xs font-mono"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirmCert && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-surface border border-red-500/30 rounded-3xl p-6 space-y-6 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-bold text-white text-xl">
                  Delete Certificate?
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <span className="text-white font-semibold font-sans">
                    "{deleteConfirmCert.title}"
                  </span>
                  ? This action will remove it from the database for all visitors.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeleteCert}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition-colors"
                >
                  Yes, Delete Permanently
                </button>
                <button
                  onClick={() => setDeleteConfirmCert(null)}
                  className="px-5 py-3 rounded-xl bg-card border border-white/10 text-secondary hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
