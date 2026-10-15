/**
 * Trademarkapply - Legal Services CRM & Stamp Paper Draft Studio
 * Allows merging legal drafts (Form TM-48, Copyright, POA) onto Stamp Papers with editable Date & Serial Number
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  Printer,
  Sparkles,
  Layers,
  FileCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle,
  FileText,
  Sliders,
  Maximize2,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { StampConfig, DraftConfig, PresetTemplate } from './types';
import { PRESET_TEMPLATES } from './data/templates';
import { StampPaper } from './components/StampPaper';
import { StampControls } from './components/StampControls';
import { DraftEditor } from './components/DraftEditor';
import { SignaturePadModal } from './components/SignaturePadModal';
import { exportToPdf, printStampPaper } from './utils/pdfExport';

export default function App() {
  // Initial default: Shaila Fahim Khan (User's uploaded draft 1) with Uttar Pradesh L 361682 & 13 OCT 2026
  const defaultTemplate = PRESET_TEMPLATES[0];

  const [stampConfig, setStampConfig] = useState<StampConfig>({
    serialNumber: defaultTemplate.stampConfig.serialNumber || 'L 361682',
    stampDate: defaultTemplate.stampConfig.stampDate || '13 OCT 2026',
    state: defaultTemplate.stampConfig.state || 'UTTAR PRADESH',
    stateHindi: defaultTemplate.stampConfig.stateHindi || 'उत्तर प्रदेश',
    denomination: defaultTemplate.stampConfig.denomination || 500,
    showPerforations: true,
    bgMode: 'authentic_vector',
    customBgImage: null,
    customDateX: 20,
    customDateY: 35,
    customNumberX: 85,
    customNumberY: 88,
  });

  const [draftConfig, setDraftConfig] = useState<DraftConfig>({
    mode: 'form_tm48',
    formData: {
      applicantName: defaultTemplate.formData.applicantName || 'SHAILA FAHIM KHAN',
      applicantAddress:
        defaultTemplate.formData.applicantAddress ||
        'ROOM NO. 11, BK NO. 402, NEAR RAJVEER DARBAR, ULHASNAGAR-1, DISTRICT THANE, MAHARASHTRA – 421001, INDIA',
      agentName: defaultTemplate.formData.agentName || 'FARHEEN MUSHIR',
      agentCode: defaultTemplate.formData.agentCode || '50565',
      agentAddress:
        defaultTemplate.formData.agentAddress ||
        'BUILDING: 36E, AGA MEHDI STREET, PARK STREET, KOLKATA WEST BENGAL, 700016',
      datedDay: defaultTemplate.formData.datedDay || '14',
      datedMonth: defaultTemplate.formData.datedMonth || '10',
      datedYear: defaultTemplate.formData.datedYear || '2026',
      jurisdiction:
        defaultTemplate.formData.jurisdiction ||
        'MUMBAI / CALCUTTA / AHMEDABAD / DELHI / CHENNAI',
      signatoryName: defaultTemplate.formData.signatoryName || 'SHAILA FAHIM KHAN',
      signatoryDesignation: defaultTemplate.formData.signatoryDesignation || 'OWNER',
      hasLegalizationNote: true,
      signatureImage: null,
    },
    freeDraftText: defaultTemplate.freeDraftText,
    layout: {
      topOffsetMm: 98,
      fontSizePt: 9.4,
      lineHeight: 1.28,
      fontFamily: 'EB Garamond',
      leftMarginMm: 18,
      rightMarginMm: 15,
      bottomMarginMm: 8,
      textAlign: 'justify',
    },
  });

  const [activeTab, setActiveTab] = useState<'stamp' | 'draft'>('stamp');
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Responsive zoom fit on initial load
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const availableW = previewContainerRef.current.clientWidth - 48;
        const targetScale = Math.min(Math.max(availableW / 820, 0.45), 1);
        setZoomScale(Number(targetScale.toFixed(2)));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const handleSelectTemplate = (template: PresetTemplate) => {
    if (template.stampConfig) {
      setStampConfig((prev) => ({
        ...prev,
        ...template.stampConfig,
      }));
    }
    if (template.formData) {
      setDraftConfig((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          ...template.formData,
        },
        freeDraftText: template.freeDraftText,
      }));
    }
    showToast(`Loaded "${template.name}" draft & stamp parameters!`, 'info');
  };

  const handleAutoFit = () => {
    // Intelligently compute balanced font size and line height so content strictly fits within 1 page
    setDraftConfig((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        fontSizePt: 9.8,
        lineHeight: 1.32,
      },
    }));
    showToast('Auto-fitted draft layout to ensure 100% single page fit!', 'success');
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    setExportStatus('Rendering 1-page A4 document...');

    const fileName = `TM48_Stamp_${stampConfig.serialNumber.replace(/\s+/g, '_')}_${stampConfig.stampDate.replace(/\s+/g, '_')}.pdf`;

    const success = await exportToPdf('stamp-paper-a4', fileName, (status) => {
      setExportStatus(status);
    });

    setIsExporting(false);
    setExportStatus('');

    if (success) {
      showToast(`Downloaded 1-page PDF: ${fileName}`, 'success');
    } else {
      showToast('Failed to generate PDF. You can also use the Print button.', 'info');
    }
  };

  const handlePrint = () => {
    printStampPaper('stamp-paper-a4');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* TOP HEADER & ACTION BAR */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-wide text-white">Trademarkapply</h1>
              <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Stamp Paper &amp; Draft Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Form TM-48 &bull; ₹500 India Non-Judicial &bull; 1-Page PDF Downloader
            </p>
          </div>
        </div>

        {/* User's Key Request Highlight: Date & Stamp Number Quick Indicators */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Stamp Seal Date:</span>
            <span className="font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              {stampConfig.stampDate}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Stamp No:</span>
            <span className="font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
              {stampConfig.serialNumber}
            </span>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Print button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            title="Open browser print dialog for direct 1-page printing"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* DOWNLOAD 1-PAGE PDF BUTTON (PRIMARY) */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{exportStatus || 'Generating PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download 1-Page PDF</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* TOAST MESSAGE */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-bounce">
          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: CONTROLS & DRAFT EDITOR (Scrollable) */}
        <div className="w-full lg:w-[460px] xl:w-[490px] bg-slate-900 border-r border-slate-800 flex flex-col h-auto lg:h-[calc(100vh-61px)] overflow-y-auto">
          {/* Tab selector for Left Panel */}
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xs border-b border-slate-800 p-3 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('stamp')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'stamp'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              1. Stamp Paper (Date &amp; No)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('draft')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'draft'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              2. Draft &amp; TM-48 Content
            </button>
          </div>

          <div className="p-4 space-y-4">
            {activeTab === 'stamp' ? (
              <StampControls
                stampConfig={stampConfig}
                onChange={(updated) => setStampConfig((prev) => ({ ...prev, ...updated }))}
              />
            ) : (
              <DraftEditor
                draftConfig={draftConfig}
                onChange={(updated) => setDraftConfig((prev) => ({ ...prev, ...updated }))}
                onSelectTemplate={handleSelectTemplate}
                onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
                onAutoFit={handleAutoFit}
              />
            )}

            {/* Quick Helper / Info Card */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 text-slate-400">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                IP India &amp; Registry Compliant
              </div>
              <p className="text-[11px] leading-relaxed">
                This tool seamlessly pastes your Form TM-48 (Agent Authorization) draft onto the
                ₹500 Stamp Paper with authentic treasury seal, custom purchase date, and stamp
                serial number. Exports to crisp 1-page A4 PDF ready for filing.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE A4 PREVIEW WORKSPACE */}
        <div
          ref={previewContainerRef}
          className="flex-1 bg-slate-950 flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto min-h-[600px]"
        >
          {/* Preview Controls Bar */}
          <div className="w-full max-w-[800px] mb-4 flex items-center justify-between flex-wrap gap-2 text-xs">
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Live Preview:</span>
              {isOverflowing ? (
                <button
                  type="button"
                  onClick={handleAutoFit}
                  className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 hover:bg-amber-500/30 transition cursor-pointer"
                >
                  <span>⚠️ Overflowing - Click to Auto-Fit</span>
                </button>
              ) : (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span>✓ 100% Fits on 1 Page</span>
                </span>
              )}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.max(0.4, Number((z - 0.05).toFixed(2))))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-300 min-w-[40px] text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.min(1.2, Number((z + 0.05).toFixed(2))))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(0.85)}
                className="p-1 text-slate-400 hover:text-white rounded ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* THE A4 STAMP PAPER CONTAINER */}
          <div className="pb-16 flex justify-center w-full">
            <StampPaper
              stampConfig={stampConfig}
              draftConfig={draftConfig}
              elementId="stamp-paper-a4"
              zoomScale={zoomScale}
              onOverflowStatusChange={(overflows) => setIsOverflowing(overflows)}
            />
          </div>
        </div>
      </div>

      {/* SIGNATURE PAD MODAL */}
      <SignaturePadModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={(dataUrl) => {
          setDraftConfig((prev) => ({
            ...prev,
            formData: {
              ...prev.formData,
              signatureImage: dataUrl,
            },
          }));
          if (dataUrl) {
            showToast('Signature added successfully to draft!', 'success');
          } else {
            showToast('Signature cleared. Empty line ready for pen signing.', 'info');
          }
        }}
        currentSignature={draftConfig.formData.signatureImage}
      />
    </div>
  );
}
