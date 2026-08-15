import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool, Eraser, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SignatureCanvasProps {
  onConfirm: (dataUrl: string) => void;
  initialSignature?: string;
  required?: boolean;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onConfirm,
  initialSignature,
  required = true
}) => {
  const { t } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(initialSignature));
  const [isConfirmed, setIsConfirmed] = useState(Boolean(initialSignature));
  const [confirmedDate, setConfirmedDate] = useState<string>(
    initialSignature ? new Date().toLocaleDateString('en-GB') : ''
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Setup canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.strokeStyle = '#8B1538'; // Katalyst maroon
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If there is an initial signature image
    if (initialSignature && initialSignature.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isConfirmed) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setErrorMsg(null);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isConfirmed) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setIsConfirmed(false);
    setErrorMsg(null);
  };

  const handleConfirm = () => {
    if (!hasDrawn) {
      setErrorMsg(t.valSignatureRequired);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    setIsConfirmed(true);
    setConfirmedDate(today);
    onConfirm(dataUrl);
  };

  const handleRedo = () => {
    setIsConfirmed(false);
  };

  return (
    <div id="katalyst-digital-signature-box" className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <PenTool className="w-4 h-4 text-rose-800" />
          <span>{t.signatureTitle}</span>
          {required && <span className="text-rose-600 font-bold">*</span>}
        </label>
        {isConfirmed ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            <span>{t.signatureConfirmedNotice} {confirmedDate}</span>
          </span>
        ) : (
          <span className="text-xs text-slate-500">
            Touch or mouse drawing supported
          </span>
        )}
      </div>

      <div className={`relative w-full rounded-xl border-2 transition-all duration-200 ${
        isConfirmed 
          ? 'border-emerald-500 bg-emerald-50/20' 
          : errorMsg 
            ? 'border-rose-400 bg-rose-50/20 shadow-sm' 
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
      }`}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`w-full h-36 sm:h-40 rounded-xl touch-none ${
            isConfirmed ? 'cursor-default opacity-90' : 'cursor-crosshair'
          }`}
          style={{ width: '100%' }}
        />

        {!hasDrawn && !isConfirmed && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs sm:text-sm text-center px-4">
            <p className="font-medium text-slate-500">{t.signatureInstruction}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Use stylus, finger, or trackpad to sign</p>
          </div>
        )}

        {/* Baseline guideline */}
        <div className="absolute left-6 right-6 bottom-8 border-b border-dashed border-slate-300 pointer-events-none flex justify-between text-[10px] text-slate-400">
          <span>Sign above line</span>
          <span>✕</span>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          id="btn-clear-signature"
          onClick={clearCanvas}
          disabled={!hasDrawn && !isConfirmed}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>{t.btnClearSignature}</span>
        </button>

        <div className="flex items-center gap-2">
          {isConfirmed ? (
            <button
              type="button"
              id="btn-redo-signature"
              onClick={handleRedo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.btnRedoSignature}</span>
            </button>
          ) : (
            <button
              type="button"
              id="btn-confirm-signature"
              onClick={handleConfirm}
              disabled={!hasDrawn}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-rose-800 hover:bg-rose-900 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.btnConfirmSignature}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
