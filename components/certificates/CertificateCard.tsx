'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink, ArrowRight, ShieldCheck, FileText, Image as ImageIcon } from 'lucide-react';
import { Certificate } from '@/lib/types';
import GlassCard from '@/components/ui/GlassCard';

interface CertificateCardProps {
  certificate: Certificate;
  onQuickView?: (certificate: Certificate) => void;
}

export default function CertificateCard({ certificate, onQuickView }: CertificateCardProps) {
  return (
    <GlassCard className="h-full flex flex-col justify-between p-6 group">
      {/* Top Header & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-surface border border-white/10 text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300">
              {certificate.fileType === 'pdf' ? (
                <FileText className="w-4 h-4" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-secondary tracking-wider uppercase">
              {certificate.category}
            </span>
          </div>

          {certificate.featured && (
            <span className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-[10px] font-mono text-accent flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Certificate Title */}
        <h3 className="font-sans font-bold text-lg text-white group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {certificate.title}
        </h3>

        {/* Issuing Organization */}
        <div className="flex items-center gap-2 text-xs text-secondary font-medium mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-accent/80" />
          <span>{certificate.organization}</span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-secondary/70 line-clamp-2 leading-relaxed mb-4 font-normal">
          {certificate.description}
        </p>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {certificate.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-secondary font-mono"
            >
              {skill}
            </span>
          ))}
          {certificate.skills.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-secondary/60">
              +{certificate.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-secondary/70 font-mono text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-secondary/50" />
          <span>{certificate.issueDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(certificate)}
              className="px-3 py-1.5 rounded-lg bg-surface hover:bg-white/10 border border-white/10 text-white text-[11px] font-medium transition-all"
            >
              Preview
            </button>
          )}

          <Link
            href={`/certificates/${certificate.id}`}
            className="px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent text-accent hover:text-black border border-accent/30 font-semibold text-[11px] transition-all flex items-center gap-1 group/btn"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
