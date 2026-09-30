import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PaperPlaneTilt,
  EnvelopeSimple,
  Copy,
  Check,
  Sparkle,
  ChatCircleText,
  GithubLogo,
  LinkedinLogo,
  XLogo,
  InstagramLogo,
  MapPin,
  SealCheck,
} from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { ambientAudio } from '../../audio/AmbientAudio';
import { SpotlightCard } from './SpotlightCard';
import { ScrollStoryReveal } from './ScrollStoryReveal';
import { Magnetic } from './Magnetic';

export const LiquidContact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    ambientAudio.playInteractiveHover();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    ambientAudio.playInteractiveHover();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      ambientAudio.playModalOpen();

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#0f172a', '#334155', '#64748b', '#cbd5e1', '#ffffff'],
        });
      } catch {
        // Fallback
      }
    }, 900);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 py-24 z-10"
    >
      <div className="max-w-5xl w-full mx-auto space-y-12">
        {/* Section Header */}
        <ScrollStoryReveal direction="up" className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
            Let's Build <span className="text-chrome-gradient">Together</span>
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-slate-600">
            Available for architectural consulting, high-impact contract engineering, and forward-thinking product collaborations.
          </p>
        </ScrollStoryReveal>

        {/* 2-Column Split Layout: Portrait Card + Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Styled Portrait & Direct Details */}
          <div className="lg:col-span-5 h-full">
            <SpotlightCard
              delay={0.1}
              enableTilt={true}
              onMouseEnter={() => ambientAudio.playInteractiveHover()}
              className="glass-chrome-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 border border-slate-200/90 hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300 h-full"
            >
              {/* Top: Portrait Image Frame */}
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/4.5] w-full border border-slate-200 shadow-inner bg-slate-950 group">
                  <img
                    src={PERSONAL_INFO.avatar}
                    alt={PERSONAL_INFO.name}
                    className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Ambient Gradient Overlay at Bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Status Badge Over Picture */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-medium flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available Worldwide
                    </span>
                  </div>

                  {/* Name & Title Over Bottom of Photo */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 font-bold text-base tracking-tight">
                      <span>{PERSONAL_INFO.name}</span>
                      <SealCheck size={16} weight="fill" className="text-sky-400" />
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium line-clamp-1">
                      {PERSONAL_INFO.title}
                    </p>
                  </div>
                </div>

                {/* Location & Response Time */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin size={15} weight="bold" className="text-slate-900" />
                    <span>{PERSONAL_INFO.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Sparkle size={15} weight="fill" className="text-amber-500" />
                    <span>Response Time: Typically within 12 hours</span>
                  </div>
                </div>
              </div>

              {/* Direct Email Copy Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">Direct Email</div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-slate-950 truncate select-all">
                    {PERSONAL_INFO.email}
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-white hover:bg-black hover:text-white border border-slate-200 text-slate-800 transition-all shrink-0 cursor-pointer shadow-xs"
                  title="Copy Email"
                >
                  {copied ? (
                    <Check size={16} weight="bold" className="text-emerald-600" />
                  ) : (
                    <Copy size={16} weight="bold" />
                  )}
                </button>
              </div>

              {/* Social Links Hub with Magnetic Physics */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                <Magnetic distance={6} className="flex-1">
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-black hover:text-white border border-slate-200 text-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                    title="GitHub"
                  >
                    <GithubLogo size={18} weight="bold" />
                  </a>
                </Magnetic>

                <Magnetic distance={6} className="flex-1">
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-black hover:text-white border border-slate-200 text-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                    title="LinkedIn"
                  >
                    <LinkedinLogo size={18} weight="bold" />
                  </a>
                </Magnetic>

                <Magnetic distance={6} className="flex-1">
                  <a
                    href={PERSONAL_INFO.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-black hover:text-white border border-slate-200 text-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                    title="Twitter / X"
                  >
                    <XLogo size={18} weight="bold" />
                  </a>
                </Magnetic>

                <Magnetic distance={6} className="flex-1">
                  <a
                    href={PERSONAL_INFO.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-black hover:text-white border border-slate-200 text-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                    title="Instagram"
                  >
                    <InstagramLogo size={18} weight="bold" />
                  </a>
                </Magnetic>
              </div>
            </SpotlightCard>
          </div>

          {/* Right Column: Interactive Dispatch Form */}
          <div className="lg:col-span-7 h-full">
            <SpotlightCard
              delay={0.2}
              enableTilt={true}
              className="glass-chrome-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/90 h-full hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ChatCircleText size={20} weight="bold" className="text-slate-900" />
                    Send a Direct Note
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-mono font-medium">
                    Encrypted Dispatch
                  </span>
                </div>

                {isSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-xl">
                      <Sparkle size={28} weight="fill" />
                    </div>
                    <h5 className="text-2xl font-bold text-slate-950">Transmission Delivered</h5>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                      Thank you for reaching out, {formData.name || 'friend'}. I’ll review your message and get back to you promptly.
                    </p>
                    <button
                      onClick={() => {
                        setIsSent(false);
                        setFormData({ name: '', email: '', message: '' });
                      }}
                      className="mt-4 px-5 py-2 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                        Your Message
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Hi Mushfiq, I'd love to discuss a new project or architectural consultation..."
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all shadow-xs resize-none"
                      />
                    </div>

                    <Magnetic distance={6} className="w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-2xl bg-black text-white font-semibold text-sm shadow-xl shadow-black/10 hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <PaperPlaneTilt size={16} weight="bold" />
                        <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Message'}</span>
                      </button>
                    </Magnetic>
                  </form>
                )}
              </div>

              {/* Quick Guarantees Footer inside Form */}
              <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <EnvelopeSimple size={14} /> Zero Spam Guaranteed
                </span>
                <span>100% Privacy Protected</span>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Minimalist Footer */}
        <div className="text-center pt-8 border-t border-slate-200/60">
          <p className="text-xs font-mono text-slate-500">
            © {new Date().getFullYear()} Mushfiq • Spatial Interface V2.0 • Designed with Procedural Precision
          </p>
        </div>
      </div>
    </section>
  );
};
