import React, { useRef, useState, useEffect } from 'react';
import { X, Check, Trash2, Upload, PenTool } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string | null) => void;
  currentSignature: string | null;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSaveDrawn = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasDrawn) {
      onSave(null);
      onClose();
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onSave(result);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Add Applicant Signature</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 px-5 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('draw')}
            className={`pb-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'draw'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PenTool className="w-4 h-4" /> Draw on Screen
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload Image / PNG
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {activeTab === 'draw' ? (
            <div>
              <p className="text-xs text-slate-500 mb-2">
                Use your finger or mouse to draw the signatory's signature:
              </p>
              <div className="border-2 border-dashed border-slate-300 rounded-lg bg-amber-50/20 overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={150}
                  className="w-full h-[150px] cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="absolute bottom-2 right-2 text-[11px] text-slate-400 pointer-events-none">
                  Sign above line
                </div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
                <div className="text-xs text-slate-400">
                  {hasDrawn ? 'Signature drawn' : 'Empty'}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition group">
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-blue-500 mb-2 transition" />
                <span className="text-sm font-medium text-slate-700">Choose signature image</span>
                <span className="text-xs text-slate-400 mt-1">PNG with transparent background recommended</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {currentSignature && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentSignature}
                      alt="Current Signature"
                      className="h-10 object-contain max-w-[120px]"
                    />
                    <span className="text-xs text-slate-600">Existing signature active</span>
                  </div>
                  <button
                    onClick={() => {
                      onSave(null);
                      onClose();
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              onSave(null);
              onClose();
            }}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
          >
            Skip / Leave blank line
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-200 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            {activeTab === 'draw' && (
              <button
                onClick={handleSaveDrawn}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" /> Apply Signature
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
