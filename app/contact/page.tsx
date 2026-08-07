'use client';

import { useState } from 'react';
import { Mail, Phone, Github, Linkedin, Instagram, Send, MessageSquare } from 'lucide-react';
import { INITIAL_USER_PROFILE } from '@/lib/certificates-data';
import GlassCard from '@/components/ui/GlassCard';
import Toast from '@/components/ui/Toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastMessage('Thank you! Your message has been sent successfully.');
      setShowToast(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-16">
      <Toast message={toastMessage} isOpen={showToast} onClose={() => setShowToast(false)} />

      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-mono text-secondary">
          <Mail className="w-3.5 h-3.5 text-accent" />
          <span>Get in Touch</span>
        </div>

        <h1 className="font-serif font-extrabold text-4xl md:text-6xl text-white tracking-tight">
          Let's Work <span className="text-gradient-accent">Together</span>
        </h1>

        <p className="text-sm md:text-base text-secondary font-light leading-relaxed">
          Have an inquiry, project proposal, or career opportunity? Reach out directly via the form below or connect through phone or social platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Contacts */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-8 space-y-6">
            <h3 className="font-sans font-bold text-white text-xl">Direct Connections</h3>

            <div className="space-y-4">
              <a
                href={`mailto:${INITIAL_USER_PROFILE.email}`}
                className="p-4 rounded-xl bg-surface border border-white/10 hover:border-accent/40 flex items-center gap-4 group transition-all"
              >
                <div className="p-3 rounded-lg bg-card text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase block">EMAIL</span>
                  <span className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                    {INITIAL_USER_PROFILE.email}
                  </span>
                </div>
              </a>

              <a
                href={`tel:${INITIAL_USER_PROFILE.phone}`}
                className="p-4 rounded-xl bg-surface border border-white/10 hover:border-accent/40 flex items-center gap-4 group transition-all"
              >
                <div className="p-3 rounded-lg bg-card text-emerald-400 group-hover:bg-accent group-hover:text-black transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase block">PHONE / MOBILE</span>
                  <span className="text-sm font-semibold text-white group-hover:text-accent transition-colors font-mono">
                    +91 {INITIAL_USER_PROFILE.phone}
                  </span>
                </div>
              </a>

              <a
                href={INITIAL_USER_PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-surface border border-white/10 hover:border-accent/40 flex items-center gap-4 group transition-all"
              >
                <div className="p-3 rounded-lg bg-card text-white group-hover:bg-accent group-hover:text-black transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase block">GITHUB</span>
                  <span className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                    github.com/rajputnipun15
                  </span>
                </div>
              </a>

              <a
                href={INITIAL_USER_PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-surface border border-white/10 hover:border-accent/40 flex items-center gap-4 group transition-all"
              >
                <div className="p-3 rounded-lg bg-card text-blue-400 group-hover:bg-accent group-hover:text-black transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase block">LINKEDIN</span>
                  <span className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                    linkedin.com/in/nipunkumarkush
                  </span>
                </div>
              </a>

              <a
                href={INITIAL_USER_PROFILE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-surface border border-white/10 hover:border-accent/40 flex items-center gap-4 group transition-all"
              >
                <div className="p-3 rounded-lg bg-card text-pink-400 group-hover:bg-accent group-hover:text-black transition-colors">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase block">INSTAGRAM</span>
                  <span className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                    instagram.com/nipun._.rajput
                  </span>
                </div>
              </a>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8 md:p-10 space-y-6">
            <h3 className="font-sans font-bold text-white text-xl flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <span>Send a Message</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-secondary">YOUR NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder:text-secondary/40 text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-secondary">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder:text-secondary/40 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-secondary">SUBJECT</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Project inquiry / Opportunity"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder:text-secondary/40 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-secondary">MESSAGE *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder:text-secondary/40 text-sm focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-accent hover:bg-accent-light text-black font-bold text-sm transition-all shadow-glow-accent flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
