'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Download, Copy, Check, ShieldCheck, Calendar, Award, Tag, Sparkles } from 'lucide-react';
import { getStoredCertificates } from '@/lib/storage';
import { Certificate } from '@/lib/types';
import PDFViewer from '@/components/certificates/PDFViewer';
import GlassCard from '@/components/ui/GlassCard';
import Toast from '@/components/ui/Toast';

export default function CertificateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const certs = getStoredCertificates();
    const found = certs.find((c) => c.id === resolvedParams.id);
    if (found) {
      setCertificate(found);
    }
  }, [resolvedParams.id]);

  if (!certificate) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-secondary text-sm font-mono">Loading certificate details...</p>
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificate.credentialId);
    setCopied(true);
    setToastMessage('Credential ID copied to clipboard!');
    setShowToast(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-8">
      <Toast
        message={toastMessage}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Back Button */}
      <Link
        href="/certificates"
        className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Certificate Library</span>
      </Link>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <PDFViewer certificate={certificate} />
        </div>

        {/* Right Column: Detailed Metadata breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-8 space-y-6">
            {/* Header info */}
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono uppercase">
                {certificate.category}
              </span>
              <h1 className="font-serif font-bold text-2xl md:text-3xl text-white leading-tight">
                {certificate.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-secondary font-medium">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>{certificate.organization}</span>
              </div>
            </div>

            <hr className="border-white/10" />

            {/* Credential Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface border border-white/10 space-y-1">
                <span className="text-secondary/60 block text-[10px]">COURSE NAME</span>
                <span className="text-white font-sans font-medium line-clamp-1">
                  {certificate.courseName}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-white/10 space-y-1">
                <span className="text-secondary/60 block text-[10px]">ISSUE DATE</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-secondary/60" />
                  {certificate.issueDate}
                </span>
              </div>

              <div className="col-span-2 p-3.5 rounded-xl bg-surface border border-white/10 space-y-2">
                <span className="text-secondary/60 block text-[10px]">CREDENTIAL ID</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-accent font-bold text-sm tracking-wider">
                    {certificate.credentialId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="px-2.5 py-1 rounded-lg bg-card hover:bg-white/10 border border-white/10 text-white text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-secondary uppercase tracking-wider">
                Overview & Curriculum
              </h4>
              <p className="text-xs text-secondary/80 leading-relaxed font-sans">
                {certificate.description}
              </p>
            </div>

            {/* Skills Learned */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-accent" />
                <span>Verified Skills Learned</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {certificate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* External Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {certificate.verificationLink && (
                <a
                  href={certificate.verificationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 rounded-xl bg-accent hover:bg-accent-light text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-glow-accent transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Verify Credential Online</span>
                </a>
              )}

              <a
                href={certificate.fileUrl}
                download
                className="px-4 py-3 rounded-xl bg-surface hover:bg-white/10 border border-white/10 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
