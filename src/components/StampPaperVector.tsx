import React from 'react';
import { StampConfig } from '../types';

interface StampPaperVectorProps {
  config: StampConfig;
}

export const StampPaperVector: React.FC<StampPaperVectorProps> = ({ config }) => {
  const { serialNumber, stampDate, state, stateHindi, denomination, showPerforations } = config;

  return (
    <div className="relative w-full select-none bg-transparent" style={{ height: '395px' }}>
      {/* 1. AUTHENTIC HIGH-RES INDIAN ₹500 STAMP PAPER HEADER (SEAMLESSLY MERGED) */}
      <div className="relative w-full h-[345px] overflow-hidden pt-2 px-2.5">
        <img
          src="/stamp-assets/authentic_stamp_500.jpg"
          alt="Government of India ₹500 Non-Judicial Stamp Paper"
          className="w-full h-full object-fill rounded-xs"
          style={{
            mixBlendMode: 'multiply',
            filter: 'contrast(1.02) saturate(1.02)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
          }}
        />

        {/* 2. OFFICIAL PURPLE TREASURY OVAL STAMP SEAL WITH EDITABLE DATE */}
        <div
          className="absolute left-[65px] top-[32px] pointer-events-none select-none"
          style={{ transform: 'rotate(-13deg)' }}
        >
          <div
            className="w-[185px] h-[118px] rounded-[50%] border-[3.5px] border-purple-800 bg-purple-100/35 backdrop-blur-2xs flex flex-col items-center justify-center p-2 shadow-xs"
            style={{
              borderColor: '#581c87',
              boxShadow: 'inset 0 0 10px rgba(88, 28, 135, 0.22)',
            }}
          >
            <div className="w-[166px] h-[100px] rounded-[50%] border border-purple-700/80 flex flex-col items-center justify-between py-1">
              {/* Hindi seal text top */}
              <span className="text-[10px] font-bold text-purple-950 tracking-wider mt-0.5">
                चक भारतीय गैर न्यायिक
              </span>

              {/* EDITABLE TREASURY STAMP DATE */}
              <div className="text-center px-2 py-0.5 my-0.5">
                <span
                  className="font-mono text-[18px] font-black tracking-widest text-purple-950 block"
                  style={{
                    letterSpacing: '0.14em',
                    textShadow: '0.5px 0.5px 1px rgba(88, 28, 135, 0.5)',
                  }}
                >
                  ★ {stampDate} ★
                </span>
              </div>

              {/* Hindi seal text bottom */}
              <span className="text-[9.5px] font-bold text-purple-950 tracking-wider mb-0.5">
                सरकार महरून रु. {denomination}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LOWER STAMP BAR: STATE NAME (LEFT) & EDITABLE SERIAL NUMBER (RIGHT) */}
      <div className="flex items-center justify-between px-8 h-[42px] mt-1 bg-transparent">
        {/* State name in Hindi & English */}
        <div className="font-serif font-bold text-slate-900 text-sm tracking-wide flex items-baseline gap-2">
          <span className="font-bold text-slate-950 text-sm">
            {stateHindi}
          </span>
          <span className="tracking-widest text-slate-950 font-black text-sm">
            {state}
          </span>
        </div>

        {/* EDITABLE STAMP SERIAL NUMBER (e.g. L 361682) */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50/70 border border-dashed border-red-400 shadow-2xs backdrop-blur-2xs">
          <span
            className="font-mono text-base font-black tracking-widest text-red-950 px-1"
            style={{
              textShadow: '0.5px 0.5px 1px rgba(185, 28, 28, 0.35)',
              letterSpacing: '0.22em',
            }}
          >
            {serialNumber}
          </span>
        </div>
      </div>

      {/* 4. Authentic Left Margin Binding Stitch / Perforations */}
      {showPerforations && (
        <div className="absolute left-2 top-0 bottom-[-520px] w-4 flex flex-col justify-between items-center pointer-events-none opacity-40">
          <div className="h-full w-px border-l-2 border-dashed border-slate-700 flex flex-col justify-around py-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1 bg-slate-800 -ml-0.5 rounded-sm my-3" />
            ))}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-700 pb-2">D.</span>
        </div>
      )}
    </div>
  );
};
