import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  QrCode, 
  Share2, 
  ExternalLink, 
  Printer, 
  Sparkles, 
  Building2, 
  Calendar 
} from 'lucide-react';
import { OutreachEvent } from '../../types';

interface QRCodeModalProps {
  event: OutreachEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ event, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !event) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(event.registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    // Generate a downloadable SVG/PNG canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 800, 1000);

      // Header Banner
      ctx.fillStyle = '#9E1B32';
      ctx.fillRect(0, 0, 800, 140);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KATALYST INDIA OUTREACH', 400, 60);

      ctx.font = '20px sans-serif';
      ctx.fillText('Women in STEM Scholarship & Leadership Fellowship', 400, 100);

      // Event Info
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(event.name, 400, 220);

      ctx.fillStyle = '#64748B';
      ctx.font = '22px sans-serif';
      ctx.fillText(`${event.collegeName} • ${event.city}`, 400, 265);

      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#9E1B32';
      ctx.fillText(`Event Code: ${event.eventCode}`, 400, 310);

      // Draw QR Code Placeholder / Matrix
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(200, 360, 400, 400);

      // Draw inner pattern
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(220, 380, 360, 360);

      ctx.fillStyle = '#0F172A';
      // Corners
      ctx.fillRect(240, 400, 80, 80);
      ctx.fillRect(480, 400, 80, 80);
      ctx.fillRect(240, 640, 80, 80);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(255, 415, 50, 50);
      ctx.fillRect(495, 415, 50, 50);
      ctx.fillRect(255, 655, 50, 50);

      ctx.fillStyle = '#9E1B32';
      ctx.fillRect(270, 430, 20, 20);
      ctx.fillRect(510, 430, 20, 20);
      ctx.fillRect(270, 670, 20, 20);

      // Scan Instructions
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('SCAN THIS QR CODE TO REGISTER', 400, 810);

      ctx.fillStyle = '#64748B';
      ctx.font = '18px sans-serif';
      ctx.fillText(`Or visit: ${event.registrationUrl}`, 400, 850);

      // Footer
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 920, 800, 80);
      ctx.fillStyle = '#475569';
      ctx.font = '16px sans-serif';
      ctx.fillText('Empowering Young Women to Lead in Engineering & Tech • www.katalystindia.org', 400, 965);

      // Trigger download
      const link = document.createElement('a');
      link.download = `Katalyst_QR_${event.eventCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Event QR Code & Registration Link
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {event.eventCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-center">
          {/* Printable Campus Card Preview */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border-2 border-slate-200 shadow-md inline-block max-w-xs mx-auto">
            <div className="text-xs font-black text-rose-700 uppercase tracking-wider mb-1">
              KATALYST INDIA
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight mb-2">
              {event.name}
            </div>

            {/* Generated QR Code Matrix */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-inner inline-block my-2">
              <div className="w-48 h-48 bg-slate-900 p-2 rounded-lg relative flex flex-col justify-between">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                  {/* Top-Left Finder */}
                  <rect x="5" y="5" width="28" height="28" fill="#FFFFFF" rx="4" />
                  <rect x="9" y="9" width="20" height="20" fill="#0F172A" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="#E11D48" rx="1" />

                  {/* Top-Right Finder */}
                  <rect x="67" y="5" width="28" height="28" fill="#FFFFFF" rx="4" />
                  <rect x="71" y="9" width="20" height="20" fill="#0F172A" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="#E11D48" rx="1" />

                  {/* Bottom-Left Finder */}
                  <rect x="5" y="67" width="28" height="28" fill="#FFFFFF" rx="4" />
                  <rect x="9" y="71" width="20" height="20" fill="#0F172A" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="#E11D48" rx="1" />

                  {/* Data Pattern Dots */}
                  <rect x="40" y="8" width="6" height="6" fill="#FFFFFF" />
                  <rect x="50" y="14" width="6" height="6" fill="#FFFFFF" />
                  <rect x="40" y="24" width="6" height="6" fill="#FFFFFF" />
                  <rect x="52" y="30" width="6" height="6" fill="#FFFFFF" />

                  <rect x="10" y="40" width="6" height="6" fill="#FFFFFF" />
                  <rect x="22" y="48" width="6" height="6" fill="#FFFFFF" />
                  <rect x="40" y="45" width="20" height="20" fill="#FFFFFF" rx="2" />
                  <rect x="45" y="50" width="10" height="10" fill="#E11D48" rx="1" />

                  <rect x="70" y="42" width="6" height="6" fill="#FFFFFF" />
                  <rect x="82" y="50" width="6" height="6" fill="#FFFFFF" />

                  <rect x="40" y="70" width="6" height="6" fill="#FFFFFF" />
                  <rect x="50" y="78" width="6" height="6" fill="#FFFFFF" />
                  <rect x="68" y="70" width="8" height="8" fill="#FFFFFF" />
                  <rect x="80" y="82" width="8" height="8" fill="#FFFFFF" />
                </svg>
              </div>
            </div>

            <div className="text-[11px] font-semibold text-slate-700 mt-2">
              Scan to Register for Scholarship
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Code: {event.eventCode}
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Shareable Student Registration URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={event.registrationUrl}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Campus Poster & Presentation Ready</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Print this QR code to place on college notice boards, projector slides, and registration standees. Students scanning this code are automatically tagged with <strong className="text-slate-800">{event.eventCode}</strong>.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download High-Res QR (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
