'use client';

import { useState } from 'react';
import { Download, ExternalLink, Maximize2, ZoomIn, ZoomOut, RotateCcw, FileText } from 'lucide-react';
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
            {certificate.fileName}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
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
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-card border border-white/10 text-secondary hover:text-white transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <a
            href={certificate.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-card border border-white/10 text-secondary hover:text-white transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={certificate.fileUrl}
            download
            className="px-3.5 py-1.5 rounded-lg bg-accent text-black font-semibold text-xs hover:bg-accent-light transition-all flex items-center gap-1.5 shadow-glow-accent"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 bg-black/60 relative overflow-auto flex items-center justify-center p-4">
        {certificate.fileType === 'image' ? (
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
