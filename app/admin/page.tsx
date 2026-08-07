'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Upload, Plus, Trash2, Edit3, Star, ArrowUp, ArrowDown, Folder, Check, X, ShieldAlert, Sparkles, RefreshCw, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { getStoredCertificates, saveCertificates, getStoredProfile, saveProfile, isAdminAuthenticated, setAdminAuthenticated } from '@/lib/storage';
import { extractMetadataFromFile } from '@/lib/pdf-parser';
import { Certificate, UserProfile, MetadataExtractionResult } from '@/lib/types';
import GlassCard from '@/components/ui/GlassCard';
import Toast from '@/components/ui/Toast';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Modal states
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<Partial<Certificate>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Drive URL state
  const [driveUrl, setDriveUrl] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    setCertificates(getStoredCertificates());
    const prof = getStoredProfile();
    setProfile(prof);
    if (prof) setDriveUrl(prof.driveFolderUrl);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'nipun2026' || passcode === 'admin') {
      setAdminAuthenticated(true);
      setAuthenticated(true);
      setToastMessage('Successfully authenticated as Admin.');
      setShowToast(true);
    } else {
      setToastMessage('Invalid Passcode. Access Denied.');
      setShowToast(true);
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthenticated(false);
  };

  // Upload & Auto-Extraction Logic
  const handleFileDrop = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setUploadFiles(fileArray);
    if (fileArray.length > 0) {
      setIsProcessing(true);
      const firstFile = fileArray[0];
      const extracted = await extractMetadataFromFile(firstFile);

      setExtractedData({
        title: extracted.title || '',
        courseName: extracted.courseName || '',
        organization: extracted.organization || 'Coursera',
        issueDate: extracted.issueDate || '2024',
        completionDate: extracted.completionDate || '2024',
        credentialId: extracted.credentialId || `CRED-${Date.now()}`,
        verificationLink: extracted.verificationLink || '',
        category: extracted.category || 'Software Engineering',
        skills: extracted.skills || ['Software Engineering'],
        description: `Verified completion certificate for ${extracted.title} issued by ${extracted.organization}.`,
        featured: false,
      });

      setIsProcessing(false);
    }
  };

  const handleSaveUploadedCert = () => {
    if (!uploadFiles.length || !extractedData.title) return;

    const newCerts: Certificate[] = [...certificates];

    uploadFiles.forEach((file, idx) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const newCert: Certificate = {
        id: `cert-user-${Date.now()}-${idx}`,
        title: idx === 0 ? (extractedData.title as string) : file.name.replace(/\.[^/.]+$/, ""),
        fileName: file.name,
        fileType: ext === 'pdf' ? 'pdf' : 'image',
        fileUrl: URL.createObjectURL(file),
        organization: (extractedData.organization as string) || 'Coursera',
        courseName: (extractedData.courseName as string) || extractedData.title || file.name,
        issueDate: (extractedData.issueDate as string) || '2024',
        completionDate: (extractedData.completionDate as string) || '2024',
        credentialId: (extractedData.credentialId as string) || `ID-${Date.now()}`,
        verificationLink: (extractedData.verificationLink as string) || 'https://coursera.org/verify',
        category: (extractedData.category as Certificate['category']) || 'Software Engineering',
        skills: (extractedData.skills as string[]) || ['Software Engineering'],
        description: (extractedData.description as string) || `Verified certificate uploaded for ${file.name}.`,
        featured: !!extractedData.featured,
        order: certificates.length + idx + 1,
        createdAt: new Date().toISOString(),
      };
      newCerts.unshift(newCert);
    });

    setCertificates(newCerts);
    saveCertificates(newCerts);

    setUploadDrawerOpen(false);
    setUploadFiles([]);
    setExtractedData({});
    setToastMessage(`Successfully uploaded ${uploadFiles.length} certificate(s)! Updated live.`);
    setShowToast(true);
  };

  // Toggle Featured
  const handleToggleFeatured = (id: string) => {
    const updated = certificates.map((c) =>
      c.id === id ? { ...c, featured: !c.featured } : c
    );
    setCertificates(updated);
    saveCertificates(updated);
    setToastMessage('Updated featured status.');
    setShowToast(true);
  };

  // Delete Certificate
  const handleDeleteCert = (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      const updated = certificates.filter((c) => c.id !== id);
      setCertificates(updated);
      saveCertificates(updated);
      setToastMessage('Certificate removed from repository.');
      setShowToast(true);
    }
  };

  // Reorder Certificate
  const handleMoveCert = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === certificates.length - 1)) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...certificates];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCertificates(updated);
    saveCertificates(updated);
  };

  // Edit Certificate Details
  const handleSaveEditedCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    const updated = certificates.map((c) => (c.id === editingCert.id ? editingCert : c));
    setCertificates(updated);
    saveCertificates(updated);
    setEditingCert(null);
    setToastMessage('Certificate details updated instantly!');
    setShowToast(true);
  };

  // Update Drive URL
  const handleSaveDriveUrl = () => {
    if (!profile) return;
    const updatedProf = { ...profile, driveFolderUrl: driveUrl };
    setProfile(updatedProf);
    saveProfile(updatedProf);
    setToastMessage('Google Drive Collection URL updated!');
    setShowToast(true);
  };

  // Render Login Lock Screen if not authenticated
  if (!authenticated) {
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
              className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white text-center font-mono text-sm focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-accent text-black font-bold text-xs uppercase tracking-wider shadow-glow-accent"
            >
              Unlock Dashboard
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
            <span>AUTHENTICATED ADMIN MODE</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-white">
            Certificate Management Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUploadDrawerOpen(true)}
            className="px-5 py-3 rounded-xl bg-accent hover:bg-accent-light text-black font-semibold text-xs flex items-center gap-2 shadow-glow-accent"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Certificate</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl bg-card border border-white/10 text-secondary hover:text-white text-xs font-mono"
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
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-card hover:bg-white/10 border border-white/10 text-white text-xs font-medium"
          >
            Save Drive Link
          </button>
        </div>
      </GlassCard>

      {/* Certificates Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-bold text-white text-xl">
            Live Repository ({certificates.length} items)
          </h3>
          <span className="text-xs font-mono text-secondary">
            Changes reflect instantly on website
          </span>
        </div>

        <div className="rounded-2xl bg-card border border-white/10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface border-b border-white/10 text-secondary font-mono">
                <th className="p-4">Order</th>
                <th className="p-4">Title & Org</th>
                <th className="p-4">Category</th>
                <th className="p-4">Credential ID</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {certificates.map((cert, index) => (
                <tr key={cert.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-mono text-secondary/60">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveCert(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:text-white disabled:opacity-20"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveCert(index, 'down')}
                        disabled={index === certificates.length - 1}
                        className="p-1 hover:text-white disabled:opacity-20"
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
                  <td className="p-4 font-mono text-accent">{cert.credentialId}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeatured(cert.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        cert.featured
                          ? 'bg-accent/20 border-accent text-accent'
                          : 'bg-surface border-white/10 text-secondary hover:text-white'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingCert(cert)}
                        className="p-2 rounded-lg bg-surface border border-white/10 text-secondary hover:text-white"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-2 rounded-lg bg-surface border border-white/10 text-red-400 hover:bg-red-500/10"
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
      </div>

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
                    Multiple file upload supported (.pdf, .png, .jpg)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  onChange={(e) => e.target.files && handleFileDrop(e.target.files)}
                  className="hidden"
                  id="admin-file-upload"
                />
                <label
                  htmlFor="admin-file-upload"
                  className="inline-block px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
                >
                  Choose Files
                </label>
              </div>

              {/* Auto Extraction Feedback & Editable Form */}
              {isProcessing && (
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-mono flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting certificate metadata using AI parser engine...</span>
                </div>
              )}

              {uploadFiles.length > 0 && !isProcessing && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Extracted Information (Editable)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-mono text-secondary">TITLE</label>
                      <input
                        type="text"
                        value={extractedData.title || ''}
                        onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-secondary">ORGANIZATION</label>
                      <input
                        type="text"
                        value={extractedData.organization || ''}
                        onChange={(e) => setExtractedData({ ...extractedData, organization: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-secondary">CREDENTIAL ID</label>
                      <input
                        type="text"
                        value={extractedData.credentialId || ''}
                        onChange={(e) => setExtractedData({ ...extractedData, credentialId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveUploadedCert}
                    className="w-full py-3.5 rounded-xl bg-accent text-black font-bold text-xs shadow-glow-accent uppercase tracking-wider"
                  >
                    Publish Certificate(s) Instantly
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
              className="w-full max-w-2xl bg-surface border border-white/15 rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-serif font-bold text-white text-xl">
                  Edit Certificate Metadata
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
                  <label className="text-[10px] font-mono text-secondary">CERTIFICATE TITLE</label>
                  <input
                    type="text"
                    value={editingCert.title}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary">ORGANIZATION</label>
                    <input
                      type="text"
                      value={editingCert.organization}
                      onChange={(e) => setEditingCert({ ...editingCert, organization: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-secondary">CREDENTIAL ID</label>
                    <input
                      type="text"
                      value={editingCert.credentialId}
                      onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-secondary">VERIFICATION LINK</label>
                  <input
                    type="url"
                    value={editingCert.verificationLink || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, verificationLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-secondary">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editingCert.description}
                    onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-white text-xs resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-accent text-black font-bold text-xs shadow-glow-accent uppercase"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-5 py-3 rounded-xl bg-card text-secondary hover:text-white text-xs font-mono"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
