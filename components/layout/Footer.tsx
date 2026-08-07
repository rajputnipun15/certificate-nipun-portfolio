'use client';

import Link from 'next/link';
import { Award, Github, Linkedin, Instagram, Mail, ArrowUp, ShieldCheck } from 'lucide-react';
import { INITIAL_USER_PROFILE } from '@/lib/certificates-data';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-surface/80 border-t border-white/[0.08] backdrop-blur-2xl text-secondary pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/[0.08]">
          {/* Brand Bio */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-card border border-white/10 flex items-center justify-center text-white font-bold font-sans">
                NK
              </div>
              <div>
                <h3 className="font-sans font-bold text-white text-base">
                  Nipun Kumar Kushwah
                </h3>
                <p className="text-xs text-secondary font-mono">
                  Software Engineer & Creative Technologist
                </p>
              </div>
            </div>
            <p className="text-sm text-secondary/80 leading-relaxed max-w-md">
              A curated digital repository documenting engineering mastery, artificial intelligence specializations, software architecture credentials, and visual creative works.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={INITIAL_USER_PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-card border border-white/10 hover:border-accent/40 text-secondary hover:text-white transition-all hover:scale-105"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={INITIAL_USER_PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-card border border-white/10 hover:border-accent/40 text-secondary hover:text-white transition-all hover:scale-105"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={INITIAL_USER_PROFILE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-card border border-white/10 hover:border-accent/40 text-secondary hover:text-white transition-all hover:scale-105"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${INITIAL_USER_PROFILE.email}`}
                className="p-2.5 rounded-xl bg-card border border-white/10 hover:border-accent/40 text-secondary hover:text-white transition-all hover:scale-105"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-sans font-semibold text-xs text-white uppercase tracking-widest font-mono">
              Explore Portfolio
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link href="/certificates" className="hover:text-accent transition-colors">
                  Certificates Library (30+)
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-accent transition-colors">
                  Skills Matrix
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Nipun
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-accent transition-colors">
                  Official Resume PDF
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Specializations & Admin */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="font-sans font-semibold text-xs text-white uppercase tracking-widest font-mono">
              Verified Domains
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                'AI & Machine Learning',
                'Web Engineering',
                'Cyber Security',
                'Data & Analytics',
                'Software Architecture',
                'UI/UX & Photography',
              ].map((domain) => (
                <span
                  key={domain}
                  className="px-3 py-1 rounded-full bg-card border border-white/[0.08] text-[11px] text-secondary"
                >
                  {domain}
                </span>
              ))}
            </div>
            <div className="pt-4">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-xs text-secondary/60 hover:text-accent transition-colors font-mono"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Access (/admin)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary/60">
          <p>© {new Date().getFullYear()} Nipun Kumar Kushwah. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-secondary hover:text-white transition-colors group"
          >
            <span>Back to top</span>
            <div className="p-1.5 rounded-lg bg-card border border-white/10 group-hover:border-accent/40 group-hover:-translate-y-0.5 transition-all">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
