'use client';

import { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, CheckCircle2, Award, Briefcase, GraduationCap, Github, Linkedin, Mail, Phone, Instagram, Code, Terminal, Layers } from 'lucide-react';
import { getStoredProfile } from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import GlassCard from '@/components/ui/GlassCard';

export default function ResumePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-mono text-secondary">
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span>Verified Official Resume</span>
          </div>

          <h1 className="font-serif font-extrabold text-4xl md:text-6xl text-white tracking-tight">
            Official <span className="text-gradient-accent">Resume</span>
          </h1>

          <p className="text-sm text-secondary font-light leading-relaxed">
            Nipun Kumar Kushwah — B.Tech Computer Science & Engineering graduate from Lovely Professional University. Full-Stack MERN developer, Autonomous QA Agent engineer, and visual creative.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-card border border-white/10 hover:border-white/20 text-white font-medium text-xs flex items-center gap-2 transition-all"
          >
            <ExternalLink className="w-4 h-4 text-accent" />
            <span>Open PDF in New Window</span>
          </a>

          <a
            href={profile.resumeUrl}
            download="Nipun_Kumar_Kushwah_Resume.pdf"
            className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-light text-black font-semibold text-xs flex items-center gap-2 shadow-glow-accent transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Resume PDF</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Interactive Resume Breakdown & Live PDF Embed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Detailed Resume Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          {/* Personal Info & Contact Details */}
          <GlassCard className="p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif font-bold text-2xl text-white">Nipun Kumar Kushwah</h2>
              <p className="text-xs font-mono text-accent">Computer Science & Engineering • MERN Stack Engineer</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-mono text-secondary">
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">{profile.email}</span>
              </a>
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{profile.phone}</span>
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Github className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>github.com/rajputnipun15</span>
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Linkedin className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>linkedin.com/in/nipunkumarkush</span>
              </a>
            </div>
          </GlassCard>

          {/* Featured Projects */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-sans font-bold text-white text-lg flex items-center gap-2">
              <Code className="w-4 h-4 text-accent" />
              <span>Projects</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-surface border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Autonomous AI Vehicle Website</span>
                  <span className="font-mono text-[10px] text-accent">Dec '25</span>
                </div>
                <p className="text-secondary/80 leading-relaxed">
                  Full-stack MERN website featuring a futuristic luxury vehicle interface with a dark premium UI, glassmorphism effects, 3D tilt animations, mouse-based parallax scrolling, and Google Gemini API integration.
                </p>
                <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px] text-secondary/60">
                  <span>React.js</span> • <span>Node.js</span> • <span>Express</span> • <span>MongoDB</span> • <span>Tailwind CSS</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Autonomous-QA-Agent</span>
                  <span className="font-mono text-[10px] text-accent">Sept '24</span>
                </div>
                <p className="text-secondary/80 leading-relaxed">
                  Autonomous QA Agent that tests web applications using browser exploration and dynamic decision logic with Playwright to simulate human-like web interactions.
                </p>
                <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px] text-secondary/60">
                  <span>JavaScript (Node.js)</span> • <span>Playwright</span> • <span>Browser Automation</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Education & Training */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-sans font-bold text-white text-lg flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-accent" />
              <span>Education & Training</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="pb-3 border-b border-white/10">
                <div className="flex justify-between font-bold text-white">
                  <span>Lovely Professional University</span>
                  <span className="font-mono text-accent text-[11px]">Aug '22 – Present</span>
                </div>
                <p className="text-secondary font-mono">B.Tech - Computer Science and Engineering (CGPA: 6.9)</p>
              </div>

              <div className="pb-3 border-b border-white/10">
                <div className="flex justify-between font-bold text-white">
                  <span>Pregrad — MERN Stack Development Training</span>
                  <span className="font-mono text-accent text-[11px]">Jun '24 - Sep '24</span>
                </div>
                <p className="text-secondary/80">Full-stack React, Node.js, Express REST APIs, and MongoDB CRUD operations.</p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-white">
                  <span>M.D International School & M.M Public School</span>
                  <span className="font-mono text-secondary text-[11px]">Bijnor, U.P</span>
                </div>
                <p className="text-secondary/80 font-mono">Intermediate (75.8%) • Matriculation (88.4%)</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Live Vector PDF Embed Viewer */}
        <div className="lg:col-span-6">
          <GlassCard className="p-3 space-y-3">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
              <span className="text-xs font-mono text-white">Nipun_Kumar_Kushwah_Resume.pdf</span>
              <a
                href={profile.resumeUrl}
                download
                className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
              >
                <span>Download</span>
                <Download className="w-3 h-3" />
              </a>
            </div>

            <div className="rounded-xl overflow-hidden bg-white h-[760px]">
              <iframe
                src={`${profile.resumeUrl}#toolbar=0&navpanes=0`}
                title="Nipun Kumar Kushwah Official Resume"
                className="w-full h-full border-0"
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
