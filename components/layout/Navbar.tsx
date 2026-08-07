'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, Menu, X, ArrowUpRight } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/storage';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Skills', href: '/skills' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3.5 bg-background/80 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 group-hover:border-accent/60 flex items-center justify-center transition-all duration-300 shadow-glass group-hover:shadow-glow-accent">
            <span className="font-sans font-bold text-base text-white group-hover:text-accent transition-colors">
              NK
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-sm tracking-tight text-white group-hover:text-accent transition-colors">
              Nipun Kumar Kushwah
            </span>
            <span className="text-[10px] text-secondary tracking-widest uppercase font-mono">
              Certificate Portfolio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface/60 border border-white/[0.08] backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 rounded-full ${
                  isActive ? 'text-white' : 'text-secondary hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className={`p-2.5 rounded-xl border text-xs transition-all duration-300 flex items-center gap-2 ${
              isAdmin
                ? 'bg-accent/10 border-accent text-accent shadow-glow-accent'
                : 'bg-surface/60 border-white/10 text-secondary hover:text-white hover:border-white/20'
            }`}
            title="Admin Dashboard"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">Admin</span>
          </Link>

          <Link
            href="/certificates"
            className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-light text-black font-semibold text-xs transition-all duration-300 shadow-glow-accent flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Browse All</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-surface border border-white/10 text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-surface/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6"
          >
            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    pathname === item.href
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-secondary flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
                <Link
                  href="/certificates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs flex items-center gap-2"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Explore Certs</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
