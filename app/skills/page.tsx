'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Sparkles, Palette, Shield, Code, ArrowRight } from 'lucide-react';
import { SKILL_CATEGORIES, INITIAL_CERTIFICATES } from '@/lib/certificates-data';
import { fetchCertificatesApi } from '@/lib/storage';
import { Certificate } from '@/lib/types';
import GlassCard from '@/components/ui/GlassCard';
import CertificateCard from '@/components/certificates/CertificateCard';

export default function SkillsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificatesApi().then((data) => {
      if (data && data.length > 0) {
        setCertificates(data);
      }
    });
  }, []);

  const matchingCertificates = selectedSkill
    ? certificates.filter((c) =>
        c.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-mono text-secondary">
          <Cpu className="w-3.5 h-3.5 text-accent" />
          <span>Technical Proficiency & Visual Arts</span>
        </div>

        <h1 className="font-serif font-extrabold text-4xl md:text-6xl text-white tracking-tight">
          Skills & <span className="text-gradient-accent">Competencies</span>
        </h1>

        <p className="text-sm md:text-base text-secondary font-light leading-relaxed">
          Comprehensive technical taxonomy encompassing core systems languages, full-stack web engineering, artificial intelligence models, cybersecurity defense, and visual design principles. Select a skill to inspect supporting verified credentials.
        </p>
      </div>

      {/* Skills Categories Matrix */}
      <div className="space-y-12">
        {SKILL_CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-6">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <h2 className="font-sans font-bold text-xl md:text-2xl text-white">
                {category.name}
              </h2>
              <p className="text-xs text-secondary/70 font-mono">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.skills.map((skill) => {
                const count = certificates.filter((c) =>
                  c.skills.some((s) => s.toLowerCase() === skill.name.toLowerCase())
                ).length;
                const isSelected = selectedSkill === skill.name;

                return (
                  <GlassCard
                    key={skill.name}
                    onClick={() => setSelectedSkill(isSelected ? null : skill.name)}
                    glowOnHover={true}
                    className={`p-5 cursor-pointer transition-all ${
                      isSelected ? 'border-accent bg-accent/10 shadow-glow-accent' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-sans font-bold text-white text-base">
                            {skill.name}
                          </h3>
                          {skill.highlight && (
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-secondary block">
                          {skill.level} • {skill.experienceYears}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-lg bg-surface border border-white/10 text-xs font-mono text-accent font-bold">
                          {count} {count === 1 ? 'Cert' : 'Certs'}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Skill Certificate Filter Section */}
      {selectedSkill && (
        <div className="pt-8 space-y-6 border-t border-accent/30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-accent uppercase tracking-widest">
                FILTERED PROOF OF COMPREHENSION
              </span>
              <h2 className="font-sans font-bold text-2xl text-white">
                Certificates validating <span className="text-accent">"{selectedSkill}"</span>
              </h2>
            </div>
            <button
              onClick={() => setSelectedSkill(null)}
              className="px-4 py-2 rounded-xl bg-surface border border-white/10 text-xs font-mono text-secondary hover:text-white"
            >
              Clear Filter
            </button>
          </div>

          {matchingCertificates.length === 0 ? (
            <p className="text-xs text-secondary font-mono">
              No specific certificate tagged for this skill yet. Browse the full library for broader matches.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingCertificates.map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
