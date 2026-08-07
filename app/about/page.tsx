'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Award, Code, Camera, Sparkles, FolderDown, Mail, ArrowRight } from 'lucide-react';
import { INITIAL_USER_PROFILE } from '@/lib/certificates-data';
import GlassCard from '@/components/ui/GlassCard';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-20">
      {/* Header Profile Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-mono text-secondary">
            <User className="w-3.5 h-3.5 text-accent" />
            <span>Editorial Biography & Mindset</span>
          </div>

          <h1 className="font-serif font-extrabold text-4xl md:text-6xl text-white tracking-tight leading-[1.1]">
            About <span className="text-gradient-accent">Nipun Kumar Kushwah</span>
          </h1>

          <p className="text-base md:text-lg text-secondary font-light leading-relaxed">
            Software Engineer • Full Stack Developer • Graphic Designer • Photographer • Creative Thinker
          </p>

          <p className="text-sm md:text-base text-secondary/80 leading-relaxed font-sans">
            Passionate about engineering elegant digital experiences, building robust scalable software systems, and crafting visual art. Dedicated to continuous learning with over 30 verified professional certifications across AI, Web Development, Cybersecurity, and Design.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/certificates"
              className="px-6 py-3.5 rounded-2xl bg-accent text-black font-semibold text-xs flex items-center gap-2 shadow-glow-accent"
            >
              <Award className="w-4 h-4" />
              <span>Browse 30+ Credentials</span>
            </Link>

            <Link
              href="/resume"
              className="px-6 py-3.5 rounded-2xl bg-card border border-white/10 hover:border-white/20 text-white font-medium text-xs flex items-center gap-2"
            >
              <FolderDown className="w-4 h-4 text-accent" />
              <span>View Official Resume</span>
            </Link>
          </div>
        </div>

        {/* Visual Card */}
        <div className="lg:col-span-5">
          <GlassCard className="p-8 space-y-6 relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-white/10 flex items-center justify-center text-accent text-3xl font-bold font-serif mb-4">
              NK
            </div>
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-white text-xl">
                Nipun Kumar Kushwah
              </h3>
              <p className="text-xs font-mono text-secondary">
                Location: India • Available for Global Roles
              </p>
            </div>
            <hr className="border-white/10" />
            <div className="space-y-3 text-xs text-secondary/80">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="font-mono text-secondary">Primary Discipline:</span>
                <span className="text-white font-semibold">Full Stack Engineering</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="font-mono text-secondary">Specialization:</span>
                <span className="text-white font-semibold">AI & Web Ecosystems</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="font-mono text-secondary">Creative Arts:</span>
                <span className="text-white font-semibold">UI/UX & Photography</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-mono text-secondary">Verified Certs:</span>
                <span className="text-accent font-bold">30 Professional Credentials</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Multidisciplinary Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest">
            THE FIVE PILLARS
          </span>
          <h2 className="font-serif font-bold text-3xl text-white">
            Multidisciplinary Expertise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-8 space-y-4">
            <div className="p-3 rounded-xl bg-surface border border-white/10 text-accent w-fit">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-white text-lg">
              Software & Full Stack Engineering
            </h3>
            <p className="text-xs text-secondary/80 leading-relaxed">
              Architecting responsive, high-performance web systems using React 19, Next.js 15, Node.js, Express, C++, Java, and MongoDB with clean software architecture principles.
            </p>
          </GlassCard>

          <GlassCard className="p-8 space-y-4">
            <div className="p-3 rounded-xl bg-surface border border-white/10 text-accent w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-white text-lg">
              Artificial Intelligence & LLMs
            </h3>
            <p className="text-xs text-secondary/80 leading-relaxed">
              Implementing Machine Learning pipelines, Transformer neural networks, and prompt engineering frameworks certified by DeepLearning.AI and Simplilearn.
            </p>
          </GlassCard>

          <GlassCard className="p-8 space-y-4">
            <div className="p-3 rounded-xl bg-surface border border-white/10 text-accent w-fit">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-white text-lg">
              UI/UX & Fine Arts Photography
            </h3>
            <p className="text-xs text-secondary/80 leading-relaxed">
              Combining visual brand identity, modern glassmorphic interface design, and fine art photography to build digital products that evoke emotion and aesthetic precision.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
