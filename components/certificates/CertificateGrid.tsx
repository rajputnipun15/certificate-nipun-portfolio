'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, LayoutGrid, List, X, Award, ExternalLink, Download } from 'lucide-react';
import { Certificate } from '@/lib/types';
import CertificateCard from './CertificateCard';
import PDFViewer from './PDFViewer';

interface CertificateGridProps {
  certificates: Certificate[];
}

const CATEGORIES = [
  'All',
  'AI & Machine Learning',
  'Web Development',
  'Cyber Security',
  'Data & Analytics',
  'Software Engineering',
  'UI/UX & Design',
];

export default function CertificateGrid({ certificates }: CertificateGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewCert, setQuickViewCert] = useState<Certificate | null>(null);

  // Filter & Sort Logic
  const filteredCertificates = useMemo(() => {
    return certificates
      .filter((cert) => {
        const matchesCategory =
          selectedCategory === 'All' || cert.category === selectedCategory;
        const matchesQuery =
          cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          );
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return a.title.localeCompare(b.title);
      });
  }, [certificates, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-white/10 backdrop-blur-xl shadow-glass">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by certificate title, organization, skill, or ID..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder:text-secondary/50 text-sm focus:outline-none focus:border-accent/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter and View Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-accent/60 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title">Sort: Alphabetical</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-surface border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-accent text-black font-semibold shadow-glow-accent'
                  : 'text-secondary hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-accent text-black font-semibold shadow-glow-accent'
                  : 'text-secondary hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                isSelected
                  ? 'bg-accent text-black font-semibold shadow-glow-accent scale-105'
                  : 'bg-card/80 hover:bg-white/10 text-secondary hover:text-white border border-white/[0.08]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Certificates Display */}
      {filteredCertificates.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center rounded-2xl bg-card/40 border border-white/10">
          <Award className="w-12 h-12 text-secondary/40 mb-4" />
          <h3 className="text-white font-sans font-bold text-lg mb-1">
            No certificates found
          </h3>
          <p className="text-secondary text-xs max-w-sm">
            Try adjusting your search query or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-6 px-4 py-2 rounded-xl bg-accent text-black text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onQuickView={(c) => setQuickViewCert(c)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl bg-card border border-white/10 hover:border-accent/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-surface border border-white/10 text-accent group-hover:border-accent/40">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white group-hover:text-accent transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-secondary font-mono mt-0.5">
                    {cert.organization} • {cert.issueDate}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-secondary font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setQuickViewCert(cert)}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-white/10 border border-white/10 text-white text-xs font-medium"
                >
                  Quick View
                </button>
                <a
                  href={`/certificates/${cert.id}`}
                  className="px-4 py-2 rounded-xl bg-accent text-black font-semibold text-xs flex items-center gap-1.5 shadow-glow-accent"
                >
                  <span>Details</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewCert && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-white/15 p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-mono uppercase">
                    {quickViewCert.category}
                  </span>
                  <h3 className="font-sans font-bold text-white text-xl mt-1">
                    {quickViewCert.title}
                  </h3>
                  <p className="text-xs text-secondary font-mono">
                    {quickViewCert.organization} • Credential ID: {quickViewCert.credentialId}
                  </p>
                </div>
                <button
                  onClick={() => setQuickViewCert(null)}
                  className="p-2 rounded-xl bg-card border border-white/10 text-secondary hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <PDFViewer certificate={quickViewCert} />

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <a
                  href={quickViewCert.verificationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                >
                  <span>Verify Credentials</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`/certificates/${quickViewCert.id}`}
                  className="px-5 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs"
                >
                  View Full Detail Page
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
