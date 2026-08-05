import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';

export default function SignatureCanvas({ onSave, currentSignature }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a'; // deep blue ink
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // check touch vs mouse
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveSignature();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSave(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-slate-700 font-bold text-sm">توقيع المتفقد المعتمد</label>
        {hasDrawn && (
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold"
          >
            <RotateCcw size={14} />
            <span>إعادة رسم</span>
          </button>
        )}
      </div>

      <div className="relative border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 overflow-hidden flex flex-col items-center justify-center p-2">
        {currentSignature && !hasDrawn ? (
          <div className="h-44 flex flex-col items-center justify-center">
            <img src={currentSignature} alt="Recorded Signature" className="max-h-36 object-contain" />
            <span className="text-xs text-slate-400 mt-2">التوقيع مسجل بنجاح</span>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={400}
            height={180}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="bg-white rounded-xl shadow-inner cursor-crosshair max-w-full"
          />
        )}
      </div>
      <p className="text-slate-400 text-xs">ارسم توقيعك باللمس أو الماوس داخل المربع الأبيض.</p>
    </div>
  );
}
