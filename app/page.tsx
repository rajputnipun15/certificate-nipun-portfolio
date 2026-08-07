'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Sparkles, FolderDown, ShieldCheck, Terminal, Cpu, Palette, Camera, Lock } from 'lucide-react';
import { getStoredCertificates, getStoredProfile } from '@/lib/storage';
import { Certificate, UserProfile } from '@/lib/types';
import CertificateCard from '@/components/certificates/CertificateCard';
import GlassCard from '@/components/ui/GlassCard';

export default function HomePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    setProfile(getStoredProfile());
    setCertificates(getStoredCertificates());
  }, []);

  const featuredCertificates = certificates.filter((c) => c.featured).slice(0, 6);
  const latestCertificates = [...certificates]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  if (!profile) return null;

  return (
    <div className="space-y-28 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12 pt-12 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-accent/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 border border-white/10 backdrop-blur-md shadow-glass"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-mono tracking-widest text-secondary uppercase">
              Official Digital Credentials Showcase
            </span>
          </motion.div>

          {/* Editorial Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="font-serif font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.05]">
              Nipun Kumar <span className="text-gradient-accent italic">Kushwah</span>
            </h1>
            <p className="font-sans text-lg md:text-xl text-secondary max-w-2xl font-light leading-relaxed">
              Software Engineer • Full Stack Developer • Graphic Designer • Photographer • Creative Thinker
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary/80 text-sm md:text-base max-w-xl leading-relaxed"
          >
            An editorial portfolio documenting 30+ verified professional certifications across Artificial Intelligence, Web Engineering, Software Architecture, and Visual Arts.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link
              href="/certificates"
              className="px-7 py-3.5 rounded-2xl bg-accent hover:bg-accent-light text-black font-semibold text-sm transition-all duration-300 shadow-glow-accent flex items-center gap-2 group"
            >
              <span>Explore Certificate Library</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={profile.driveFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-card hover:bg-surface border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all flex items-center gap-2"
            >
              <FolderDown className="w-4 h-4 text-accent" />
              <span>Complete Drive Collection</span>
            </a>
          </motion.div>
        </div>

        {/* Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-card/60 border border-white/10 backdrop-blur-xl shadow-glass"
        >
          <div className="space-y-1">
            <span className="font-mono text-3xl font-extrabold text-white">30+</span>
            <p className="text-xs text-secondary font-mono">Verified Certificates</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-3xl font-extrabold text-accent">750+</span>
            <p className="text-xs text-secondary font-mono">Learning Hours</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-3xl font-extrabold text-white">24+</span>
            <p className="text-xs text-secondary font-mono">Core Tech Skills</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-3xl font-extrabold text-white">6</span>
            <p className="text-xs text-secondary font-mono">Specialization Domains</p>
          </div>
        </motion.div>
      </section>

      {/* Featured Certificates Showcase */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-accent uppercase tracking-widest">
              Handpicked Achievements
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-white">
              Featured Certifications
            </h2>
          </div>
          <Link
            href="/certificates"
            className="text-xs font-mono text-secondary hover:text-accent flex items-center gap-1 group"
          >
            <span>View all 30 certificates</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCertificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      </section>

      {/* Latest Uploads Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-secondary uppercase tracking-widest">
              Recent Milestones
            </span>
            <h2 className="font-sans font-bold text-2xl md:text-4xl text-white">
              Latest Additions
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestCertificates.map((cert) => (
            <GlassCard key={cert.id} className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-4 rounded-xl bg-surface border border-white/10 text-accent">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-2 flex-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-secondary">
                    {cert.organization}
                  </span>
                  <h3 className="font-sans font-bold text-white text-lg">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-secondary/80 line-clamp-2">
                    {cert.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-mono text-secondary/60">
                      {cert.issueDate}
                    </span>
                    <Link
                      href={`/certificates/${cert.id}`}
                      className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Skills Matrix Overview */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono text-accent uppercase tracking-widest">
            Expertise & Capabilities
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-white">
            Core Competencies
          </h2>
          <p className="text-xs text-secondary">
            Click on any domain to explore corresponding skill badges and verified course accomplishments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 space-y-4">
            <div className="p-3 rounded-xl bg-surface border border-white/10 text-accent w-fit">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-white text-lg">Languages & Core</h3>
            <p className="text-xs text-secondary/80">Java, Python, C++, C, JavaScript</p>
            <Link href="/skills" className="text-xs text-accent hover:underline inline-block font-mono">
              Explore skills →
            </Link>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="p-3 rounded-xl bg-surface border border-white/10 text-accent w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-white text-lg">Web & Cloud</h3>
            <p className="text-xs text-secondary/80">React, Next.js, Node.js, Express, MongoDB, Tailwind</p>
            <Link href="/skills" className="text-xs text-accent hover:underline inline-block font-mono">
              Explore skills →
            </Link>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="p-3 rounded-xl bg-surface border border-white/10 text-accent w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-white text-lg">AI & Security</h3>
            <p className="text-xs text-secondary/80">Artificial Intelligence, Machine Learning, Cyber Security</p>
            <Link href="/skills" className="text-xs text-accent hover:underline inline-block font-mono">
              Explore skills →
            </Link>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="p-3 rounded-xl bg-surface border border-white/10 text-accent w-fit">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-white text-lg">Design & Media</h3>
            <p className="text-xs text-secondary/80">UI/UX Prototyping, Graphic Design, Fine Photography</p>
            <Link href="/skills" className="text-xs text-accent hover:underline inline-block font-mono">
              Explore skills →
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Editorial Quote Section */}
      <section className="max-w-5xl mx-auto px-6 md:px-12">
        <GlassCard className="p-10 md:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
          <span className="text-accent text-5xl font-serif">“</span>
          <blockquote className="font-serif italic text-xl md:text-3xl text-white max-w-3xl mx-auto leading-relaxed">
            Continuous learning is not a phase in software engineering; it is the fundamental architecture of creative craftsmanship.
          </blockquote>
          <cite className="block text-xs font-mono text-secondary not-italic uppercase tracking-widest">
            — Nipun Kumar Kushwah
          </cite>
        </GlassCard>
      </section>

      {/* Google Drive Complete Library Callout */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-card via-surface to-card border border-accent/30 shadow-glow-accent flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono">
              External Cloud Vault
            </span>
            <h3 className="font-serif font-bold text-2xl md:text-4xl text-white">
              Complete Certificate Collection
            </h3>
            <p className="text-xs md:text-sm text-secondary max-w-lg">
              Access the entire uncompressed repository of certificate PDFs and high-resolution credentials directly hosted in Google Drive.
            </p>
          </div>

          <a
            href={profile.driveFolderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl bg-accent hover:bg-accent-light text-black font-bold text-sm transition-all duration-300 shadow-glow-accent flex items-center gap-2 whitespace-nowrap"
          >
            <span>View Complete Certificate Collection</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
