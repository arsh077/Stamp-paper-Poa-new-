import React from 'react';
import { Calendar, Hash, MapPin, Upload, RefreshCw, CheckCircle2, Sliders } from 'lucide-react';
import { StampConfig } from '../types';
import { INDIAN_STATES } from '../data/templates';

interface StampControlsProps {
  stampConfig: StampConfig;
  onChange: (updated: Partial<StampConfig>) => void;
}

export const StampControls: React.FC<StampControlsProps> = ({ stampConfig, onChange }) => {
  const handleDatePreset = (dateStr: string) => {
    onChange({ stampDate: dateStr });
  };

  const handleStateChange = (stateEnglish: string) => {
    const found = INDIAN_STATES.find((s) => s.english === stateEnglish);
    if (found) {
      onChange({ state: found.english, stateHindi: found.hindi });
    }
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({
        bgMode: 'custom_upload',
        customBgImage: ev.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 text-sm tracking-wide flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          Stamp Paper Customizer
        </h3>
        <span className="text-[11px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
          Indian Non-Judicial
        </span>
      </div>

      {/* 1. EDITABLE STAMP DATE (ROUND SEAL) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-purple-600" />
            Treasury Stamp Date (Inside Seal)
          </label>
          <span className="text-[11px] text-purple-900 font-mono font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            {stampConfig.stampDate}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={stampConfig.stampDate}
            onChange={(e) => onChange({ stampDate: e.target.value.toUpperCase() })}
            placeholder="e.g. 13 OCT 2026"
            className="flex-1 px-3 py-2 text-sm font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden uppercase placeholder:text-slate-400"
          />
        </div>
        {/* Quick date presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {['13 OCT 2026', '12 OCT 2026', '14 OCT 2026', '15 OCT 2026', 'TODAY'].map((preset) => {
            const label =
              preset === 'TODAY'
                ? new Date()
                    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    .toUpperCase()
                : preset;
            const isSelected = stampConfig.stampDate === label;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handleDatePreset(label)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-mono transition font-semibold ${
                  isSelected
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                {preset === 'TODAY' ? 'Current Date' : preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. EDITABLE STAMP NUMBER (TOP RIGHT) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-red-600" />
            Stamp Serial Number
          </label>
          <span className="text-[11px] text-red-900 font-mono font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
            {stampConfig.serialNumber}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={stampConfig.serialNumber}
            onChange={(e) => onChange({ serialNumber: e.target.value.toUpperCase() })}
            placeholder="e.g. L 361682"
            className="flex-1 px-3 py-2 text-sm font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden uppercase tracking-wider placeholder:text-slate-400"
          />
          <button
            type="button"
            title="Generate Random Number"
            onClick={() => {
              const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
              const num = Math.floor(100000 + Math.random() * 900000);
              onChange({ serialNumber: `${letter} ${num}` });
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Random
          </button>
        </div>
        <div className="flex gap-2">
          {['L 361682', 'L 361683', 'K 918234', 'M 540291'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange({ serialNumber: num })}
              className={`text-[11px] font-mono px-2 py-1 rounded border font-semibold ${
                stampConfig.serialNumber === num
                  ? 'bg-red-100 border-red-400 text-red-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* 3. STATE & DENOMINATION */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-600" /> State
          </label>
          <select
            value={stampConfig.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-2.5 py-2 text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white text-slate-900"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st.english} value={st.english}>
                {st.english} ({st.hindi})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-900 mb-1.5 block">
            Denomination (Rs.)
          </label>
          <select
            value={stampConfig.denomination}
            onChange={(e) => onChange({ denomination: Number(e.target.value) })}
            className="w-full px-2.5 py-2 text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white text-slate-900"
          >
            <option value={500}>₹ 500 (Five Hundred)</option>
            <option value={100}>₹ 100 (One Hundred)</option>
            <option value={50}>₹ 50 (Fifty)</option>
          </select>
        </div>
      </div>

      {/* 4. BACKGROUND MODE: AUTHENTIC VECTOR vs UPLOAD YOUR PURCHASED STAMP */}
      <div className="pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-900 block mb-2">
          Stamp Paper Background Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ bgMode: 'authentic_vector' })}
            className={`p-2.5 rounded-lg border text-left text-xs transition flex flex-col justify-between ${
              stampConfig.bgMode === 'authentic_vector'
                ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs ring-1 ring-blue-500'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <span className="flex items-center gap-1 font-bold">
              {stampConfig.bgMode === 'authentic_vector' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              )}
              Authentic ₹500 Vector
            </span>
            <span className="text-[10px] text-slate-600 mt-1">
              Crystal-clear 300 DPI vector graphic
            </span>
          </button>

          <label
            className={`p-2.5 rounded-lg border cursor-pointer text-left text-xs transition flex flex-col justify-between ${
              stampConfig.bgMode === 'custom_upload'
                ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs ring-1 ring-blue-500'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <span className="flex items-center gap-1 font-bold">
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              Upload Scanned Stamp
            </span>
            <span className="text-[10px] text-slate-600 mt-1">
              {stampConfig.customBgImage ? 'Custom scan loaded' : 'Use your photo/scan'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomImageUpload}
            />
          </label>
        </div>

        {/* If user uploaded, show position sliders for custom overlay */}
        {stampConfig.bgMode === 'custom_upload' && stampConfig.customBgImage && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs space-y-2">
            <span className="font-bold text-amber-950 block">
              Calibrate Date &amp; Number on your scan:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-amber-900 font-semibold">Date Seal X / Y</label>
                <div className="flex gap-1">
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={stampConfig.customDateX}
                    onChange={(e) => onChange({ customDateX: Number(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={stampConfig.customDateY}
                    onChange={(e) => onChange({ customDateY: Number(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-amber-900 font-semibold">Stamp No X / Y</label>
                <div className="flex gap-1">
                  <input
                    type="range"
                    min="60"
                    max="95"
                    value={stampConfig.customNumberX}
                    onChange={(e) => onChange({ customNumberX: Number(e.target.value) })}
                    className="w-full accent-red-600"
                  />
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={stampConfig.customNumberY}
                    onChange={(e) => onChange({ customNumberY: Number(e.target.value) })}
                    className="w-full accent-red-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Perforations & Stitch toggle */}
      <div className="flex items-center justify-between pt-1">
        <label className="text-xs text-slate-800 font-semibold cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={stampConfig.showPerforations}
            onChange={(e) => onChange({ showPerforations: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Show left margin stitch/binding holes &amp; &quot;D.&quot;
        </label>
      </div>
    </div>
  );
};
