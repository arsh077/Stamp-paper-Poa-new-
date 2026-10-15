import React from 'react';
import {
  FileText,
  Edit3,
  PenTool,
  Maximize2,
  Sparkles,
  Type,
  AlignLeft,
  AlignJustify,
  SlidersHorizontal,
} from 'lucide-react';
import { DraftConfig, TM48FormData, PresetTemplate } from '../types';
import { PRESET_TEMPLATES } from '../data/templates';

interface DraftEditorProps {
  draftConfig: DraftConfig;
  onChange: (updated: Partial<DraftConfig>) => void;
  onSelectTemplate: (template: PresetTemplate) => void;
  onOpenSignatureModal: () => void;
  onAutoFit: () => void;
}

export const DraftEditor: React.FC<DraftEditorProps> = ({
  draftConfig,
  onChange,
  onSelectTemplate,
  onOpenSignatureModal,
  onAutoFit,
}) => {
  const { mode, formData, freeDraftText, layout } = draftConfig;

  const handleFormChange = (key: keyof TM48FormData, value: unknown) => {
    onChange({
      formData: {
        ...formData,
        [key]: value,
      },
    });
  };

  const handleLayoutChange = (key: keyof typeof layout, value: unknown) => {
    onChange({
      layout: {
        ...layout,
        [key]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5 text-slate-900">
      {/* PRESET SAMPLES (User's Exact Drafts) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Presets (Your Uploaded Drafts)
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onSelectTemplate(tmpl)}
              className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  {tmpl.badge}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-600 truncate mt-0.5">{tmpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* MODE TABS: STRUCTURED FORM vs FREE PASTE DRAFT */}
      <div className="border-b border-slate-200 flex gap-2">
        <button
          type="button"
          onClick={() => onChange({ mode: 'form_tm48' })}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
            mode === 'form_tm48'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Form TM-48 Fields
        </button>
        <button
          type="button"
          onClick={() => onChange({ mode: 'free_draft' })}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
            mode === 'free_draft'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Paste Custom Draft (Raw Text)
        </button>
      </div>

      {/* TAB 1: FORM FIELDS */}
      {mode === 'form_tm48' ? (
        <div className="space-y-3.5 text-xs">
          {/* Applicant Name */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Applicant Name / Company Name
            </label>
            <input
              type="text"
              value={formData.applicantName}
              onChange={(e) => handleFormChange('applicantName', e.target.value.toUpperCase())}
              placeholder="e.g. SHAILA FAHIM KHAN"
              className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden uppercase placeholder:text-slate-400"
            />
          </div>

          {/* Applicant Address */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Applicant Complete Address
            </label>
            <textarea
              rows={2}
              value={formData.applicantAddress}
              onChange={(e) => handleFormChange('applicantAddress', e.target.value.toUpperCase())}
              placeholder="e.g. ROOM NO. 11, BK NO. 402, NEAR RAJVEER DARBAR, ULHASNAGAR-1..."
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden uppercase leading-snug placeholder:text-slate-400"
            />
          </div>

          {/* Agent Information (Farheen Mushir 50565) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-900 block mb-1">Agent Name</label>
              <input
                type="text"
                value={formData.agentName}
                onChange={(e) => handleFormChange('agentName', e.target.value.toUpperCase())}
                placeholder="e.g. FARHEEN MUSHIR"
                className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden uppercase placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="font-bold text-slate-900 block mb-1">Agent Code</label>
              <input
                type="text"
                value={formData.agentCode}
                onChange={(e) => handleFormChange('agentCode', e.target.value)}
                placeholder="e.g. 50565"
                className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Agent Communication Address */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Communication Address in India
            </label>
            <input
              type="text"
              value={formData.agentAddress}
              onChange={(e) => handleFormChange('agentAddress', e.target.value.toUpperCase())}
              placeholder="e.g. BUILDING: 36E, AGA MEHDI STREET, PARK STREET, KOLKATA..."
              className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden uppercase placeholder:text-slate-400"
            />
          </div>

          {/* Date of Form TM-48 */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Date on Form (&quot;Dated this ... day of ...&quot;)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={formData.datedDay}
                onChange={(e) => handleFormChange('datedDay', e.target.value)}
                placeholder="Day (14)"
                className="px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg text-center"
              />
              <input
                type="text"
                value={formData.datedMonth}
                onChange={(e) => handleFormChange('datedMonth', e.target.value)}
                placeholder="Month (10)"
                className="px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg text-center"
              />
              <input
                type="text"
                value={formData.datedYear}
                onChange={(e) => handleFormChange('datedYear', e.target.value)}
                placeholder="Year (2026)"
                className="px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg text-center"
              />
            </div>
          </div>

          {/* Signatory Name & Designation */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-900 block mb-1">Signatory Name</label>
              <input
                type="text"
                value={formData.signatoryName}
                onChange={(e) => handleFormChange('signatoryName', e.target.value.toUpperCase())}
                placeholder="e.g. SHAILA FAHIM KHAN"
                className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg uppercase placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="font-bold text-slate-900 block mb-1">Designation</label>
              <input
                type="text"
                value={formData.signatoryDesignation}
                onChange={(e) =>
                  handleFormChange('signatoryDesignation', e.target.value.toUpperCase())
                }
                placeholder="e.g. OWNER / PROPRIETOR"
                className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg uppercase placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Signature Action */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-slate-700" />
              <div>
                <span className="font-bold text-slate-900 block">Applicant Signature</span>
                <span className="text-[10px] text-slate-600">
                  {formData.signatureImage ? 'Signature attached' : 'Blank line for manual pen sign'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenSignatureModal}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-md font-bold text-xs shadow-xs transition"
            >
              {formData.signatureImage ? 'Edit / Remove' : 'Draw or Upload'}
            </button>
          </div>
        </div>
      ) : (
        /* TAB 2: FREE TEXT DRAFT (PASTE ANY DRAFT) */
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900">
              Paste or type your draft text here:
            </label>
            <span className="text-[10px] text-slate-500 font-medium">
              {freeDraftText.split('\n').length} lines
            </span>
          </div>
          <textarea
            rows={14}
            value={freeDraftText}
            onChange={(e) => onChange({ freeDraftText: e.target.value })}
            placeholder="Paste your trademark draft, copyright agreement, power of attorney, or affidavit text here..."
            className="w-full px-3.5 py-2.5 text-xs font-serif text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed shadow-inner"
          />
        </div>
      )}

      {/* 1-PAGE AUTO-FIT & TYPOGRAPHY SETTINGS */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            1-Page Layout &amp; Alignment
          </span>
          <button
            type="button"
            onClick={onAutoFit}
            className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs transition active:scale-95"
            title="Automatically adjust font size and line spacing to strictly fit on 1 single page"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Auto-Fit to 1 Page
          </button>
        </div>

        {/* Font Size & Line Height */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-800 font-semibold flex items-center gap-1">
                <Type className="w-3 h-3 text-slate-500" /> Font Size
              </label>
              <span className="font-mono font-bold text-slate-950">{layout.fontSizePt} pt</span>
            </div>
            <input
              type="range"
              min="8.5"
              max="13"
              step="0.25"
              value={layout.fontSizePt}
              onChange={(e) => handleLayoutChange('fontSizePt', Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-800 font-semibold">Line Spacing</label>
              <span className="font-mono font-bold text-slate-950">{layout.lineHeight}x</span>
            </div>
            <input
              type="range"
              min="1.15"
              max="1.75"
              step="0.05"
              value={layout.lineHeight}
              onChange={(e) => handleLayoutChange('lineHeight', Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        {/* Font Family & Alignment */}
        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <label className="text-slate-800 font-semibold block mb-1">Legal Font</label>
            <select
              value={layout.fontFamily}
              onChange={(e) => handleLayoutChange('fontFamily', e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 font-medium"
            >
              <option value="EB Garamond, serif">EB Garamond (Classic Legal)</option>
              <option value="'Times New Roman', Times, serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Tinos', serif">Tinos (Modern Serif)</option>
              <option value="Arial, sans-serif">Arial</option>
            </select>
          </div>

          <div>
            <label className="text-slate-800 font-semibold block mb-1">Text Alignment</label>
            <div className="flex border border-slate-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => handleLayoutChange('textAlign', 'justify')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition ${
                  layout.textAlign === 'justify'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlignJustify className="w-3.5 h-3.5" /> Justify
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange('textAlign', 'left')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition ${
                  layout.textAlign === 'left'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" /> Left
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
