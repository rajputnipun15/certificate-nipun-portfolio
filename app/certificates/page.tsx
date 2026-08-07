'use client';

import { useState, useEffect } from 'react';
import { getStoredCertificates } from '@/lib/storage';
import { Certificate } from '@/lib/types';
import CertificateGrid from '@/components/certificates/CertificateGrid';
import { Award, Sparkles } from 'lucide-react';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    setCertificates(getStoredCertificates());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-mono text-secondary">
          <Award className="w-3.5 h-3.5 text-accent" />
          <span>Curated Credentials Vault</span>
        </div>

        <h1 className="font-serif font-extrabold text-4xl md:text-6xl text-white tracking-tight">
          Certificate <span className="text-gradient-accent">Library</span>
        </h1>

        <p className="text-sm md:text-base text-secondary font-light leading-relaxed">
          Browse all {certificates.length} verified certificates earned across Artificial Intelligence, Software Engineering, Cyber Security, Full-Stack Web Development, Data Analytics, and Visual Arts.
        </p>
      </div>

      {/* Main Grid */}
      <CertificateGrid certificates={certificates} />
    </div>
  );
}
