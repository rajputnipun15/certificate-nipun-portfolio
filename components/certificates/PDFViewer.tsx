'use client';

import { useState } from 'react';
import { Download, ExternalLink, Maximize2, ZoomIn, ZoomOut, RotateCcw, FileText, Award, ShieldCheck } from 'lucide-react';
import { Certificate } from '@/lib/types';

interface PDFViewerProps {
  certificate: Certificate;
}

export default function PDFViewer({ certificate }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 75));
  const handleResetZoom = () => setZoom(100);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const hasFile = Boolean(certificate.fileUrl && certificate.fileUrl.trim() !== '');

  return (
    <div
      className={`relative rounded-2xl bg-card border border-white/10 overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-[9999] shadow-2xl bg-background' : 'w-full h-[550px]'
      }`}
    >
      {/* Viewer Control Bar */}
      <div className="px-6 py-3.5 bg-surface border-b border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-card border border-white/10 text-accent">
            <FileText className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono text-white truncate max-w-[200px] sm:max-w-xs">
            {certificate.fileName || `${certificate.title}.pdf`}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasFile && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-card border border-white/10 text-xs font-mono text-secondary">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 hover:text-white transition-colors border-l border-white/10 ml-1 pl-1.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-card border border-white/10 text-secondary hover:text-white transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {certificate.verificationLink && (
            <a
              href={certificate.verificationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-card border border-white/10 text-secondary hover:text-white transition-colors"
              title="Verify online"
            >
              <ExternalLink className="w-4 h-4 text-accent" />
            </a>
          )}

          {hasFile && (
            <a
              href={certificate.fileUrl}
              download={certificate.fileName || `${certificate.title}.pdf`}
              className="px-3.5 py-1.5 rounded-lg bg-accent text-black font-semibold text-xs hover:bg-accent-light transition-all flex items-center gap-1.5 shadow-glow-accent"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 bg-black/60 relative overflow-auto flex items-center justify-center p-4">
        {!hasFile ? (
          <div className="p-8 text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-white/10 flex items-center justify-center mx-auto text-accent shadow-glow-accent">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-white text-lg">{certificate.title}</h3>
              <p className="text-xs text-secondary font-mono">Issued by {certificate.organization}</p>
            </div>
            <p className="text-xs text-secondary/80 font-sans leading-relaxed">
              This credential was verified online directly through the issuing authority.
            </p>
            {certificate.verificationLink && (
              <a
                href={certificate.verificationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs shadow-glow-accent hover:bg-accent-light transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Verify Credential on {certificate.organization}</span>
              </a>
            )}
          </div>
        ) : certificate.fileType === 'image' ? (
          <img
            src={certificate.fileUrl}
            alt={certificate.title}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <iframe
              src={`${certificate.fileUrl}#toolbar=0&navpanes=0`}
              title={certificate.title}
              className="w-full h-full rounded-lg border-0 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
