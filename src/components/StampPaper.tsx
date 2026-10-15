import React, { useRef, useEffect, useState } from 'react';
import { StampConfig, DraftConfig } from '../types';
import { StampPaperVector } from './StampPaperVector';

interface StampPaperProps {
  stampConfig: StampConfig;
  draftConfig: DraftConfig;
  elementId?: string;
  zoomScale?: number;
  onOverflowStatusChange?: (isOverflowing: boolean) => void;
}

export const StampPaper: React.FC<StampPaperProps> = ({
  stampConfig,
  draftConfig,
  elementId = 'stamp-paper-a4',
  zoomScale = 1,
  onOverflowStatusChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const scrollH = containerRef.current.scrollHeight;
      const clientH = containerRef.current.clientHeight;
      const overflows = scrollH > clientH + 5;
      setIsOverflowing(overflows);
      onOverflowStatusChange?.(overflows);
    }
  }, [stampConfig, draftConfig, onOverflowStatusChange]);

  const { mode, formData, freeDraftText, layout } = draftConfig;

  return (
    <div
      style={{
        transform: `scale(${zoomScale})`,
        transformOrigin: 'top center',
      }}
      className="transition-transform duration-200"
    >
      {/* 
        Strict A4 Dimensions:
        Width: 794px (~210mm at 96dpi)
        Height: 1123px (~297mm at 96dpi)
      */}
      <div
        id={elementId}
        ref={containerRef}
        style={{
          width: '794px',
          height: '1123px',
          fontFamily: layout.fontFamily || 'Times New Roman, serif',
          backgroundColor: '#f9f6ef',
          backgroundImage: "url('/stamp-assets/paper_texture.jpg')",
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
        className="relative shadow-2xl text-slate-950 overflow-hidden flex flex-col justify-between"
      >
        {/* TOP SECTION: STAMP PAPER HEADER */}
        {stampConfig.bgMode === 'authentic_vector' ? (
          <StampPaperVector config={stampConfig} />
        ) : (
          /* User Uploaded Custom Scanned Stamp Paper */
          <div className="relative w-full h-[340px] overflow-hidden bg-slate-100 border-b border-slate-300">
            {stampConfig.customBgImage ? (
              <img
                src={stampConfig.customBgImage}
                alt="Uploaded Stamp Paper"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No stamp paper image uploaded
              </div>
            )}

            {/* Custom Calibrated Date Seal on Uploaded Image */}
            <div
              style={{
                position: 'absolute',
                left: `${stampConfig.customDateX}%`,
                top: `${stampConfig.customDateY}%`,
                transform: 'translate(-50%, -50%) rotate(-12deg)',
              }}
              className="pointer-events-none select-none text-center"
            >
              <div className="px-3 py-1 rounded-full border-2 border-dashed border-purple-800 bg-purple-100/60 backdrop-blur-xs shadow-xs">
                <span className="text-[10px] block font-serif font-bold text-purple-900 leading-none">
                  चक भारतीय गैर न्यायिक
                </span>
                <span className="text-base font-black font-mono tracking-widest text-purple-950 block my-0.5">
                  {stampConfig.stampDate}
                </span>
                <span className="text-[9px] block font-serif font-bold text-purple-900 leading-none">
                  रु. {stampConfig.denomination}
                </span>
              </div>
            </div>

            {/* Custom Calibrated Serial Number on Uploaded Image */}
            <div
              style={{
                position: 'absolute',
                left: `${stampConfig.customNumberX}%`,
                top: `${stampConfig.customNumberY}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="pointer-events-none select-none"
            >
              <span className="font-mono text-base font-extrabold tracking-widest text-red-950 px-2 py-0.5 bg-white/70 border border-dashed border-red-300 rounded shadow-xs">
                {stampConfig.serialNumber}
              </span>
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: DRAFT LEGAL CONTENT */}
        <div
          className="flex-1 px-12 pt-6 pb-8 flex flex-col justify-between"
          style={{
            paddingLeft: `${layout.leftMarginMm * 3.78}px`,
            paddingRight: `${layout.rightMarginMm * 3.78}px`,
            paddingBottom: `${layout.bottomMarginMm * 3.78}px`,
            fontSize: `${layout.fontSizePt}pt`,
            lineHeight: layout.lineHeight,
            textAlign: layout.textAlign,
          }}
        >
          {mode === 'form_tm48' ? (
            /* Structured Form TM-48 matching exactly user's screenshot */
            <div className="flex-1 flex flex-col justify-between text-slate-900">
              {/* Form Header */}
              <div>
                <div className="flex justify-end items-center mb-1 pr-1">
                  <span className="text-[10pt] font-bold text-slate-800 tracking-widest">
                    INDIA
                  </span>
                </div>

                <div className="text-center my-1">
                  <h1 className="font-bold text-[13pt] tracking-widest leading-tight">
                    FORM TM-48
                  </h1>
                  <h2 className="font-bold text-[10.8pt] tracking-wide leading-tight">
                    THE TRADE MARKS ACT, 1999
                  </h2>
                  <p className="font-semibold text-[10pt] leading-tight">
                    Form of authorization of an Agent
                  </p>
                  <p className="text-[9pt] italic text-slate-700 leading-tight">
                    (Section 145, Rule 21)
                  </p>
                </div>

                <div className="text-right font-semibold text-[9.5pt] mt-1 mb-2">
                  Agent&apos;s Code No.: <span className="font-bold text-slate-950">{formData.agentCode}</span>
                </div>

                {/* Applicant Info */}
                <div className="mb-2 text-left">
                  <div className="font-semibold text-[10pt] text-slate-700">I/We,</div>
                  <div className="font-bold text-[11pt] tracking-wide uppercase text-slate-950">
                    {formData.applicantName}
                  </div>
                  <div className="text-[9.8pt] uppercase text-slate-800 leading-snug">
                    {formData.applicantAddress}
                  </div>
                </div>

                {/* Authorization Clause */}
                <p className="text-[9.6pt] text-justify leading-snug mb-2">
                  hereby authorize <strong className="font-bold tracking-wide">{formData.agentName}</strong> to act
                  as my/our agents for the purpose of making applications and obtaining registrations of all trademarks,
                  filing notices of opposition and applications for rectification under the provisions of The Trade Marks Act,
                  1999 and to represent me/us in all matters in connection therewith and to maintain registrations in force
                  and to act in all matters under the Act and also authorize them jointly and severally to sign such papers
                  and writings on my/our behalf and also to appoint substitute(s) as may be necessary or expedient and
                  request that all notices, requisitions and communications relating thereto may be sent to such Agents at
                  the above address.
                </p>

                {/* Revocation & Confirmation */}
                <p className="text-[9.6pt] mb-1.5 leading-snug text-justify">
                  I/We hereby revoke all previous authorizations, if any, in respect of the proceeding.
                </p>
                <p className="text-[9.6pt] mb-2 leading-snug text-justify">
                  I/We hereby ratify and confirm the action already taken by the said person(s) by virtue of this
                  authorization.
                </p>

                {/* Service Address */}
                <div className="text-[9.6pt] mb-2 leading-snug text-left">
                  All communications relating to this application may be sent to the following address in India:
                  <div className="font-bold uppercase tracking-wide mt-0.5 text-[9.4pt] text-slate-950">
                    {formData.agentAddress}
                  </div>
                </div>

                {/* Date */}
                <div className="font-medium text-[9.8pt] mb-2 text-left">
                  Dated this <span className="font-bold">{formData.datedDay}</span> day of{' '}
                  <span className="font-bold">{formData.datedMonth}</span> , 20{' '}
                  <span className="font-bold">{formData.datedYear}</span> .
                </div>
              </div>

              {/* Lower Section: Registrar Address (Left) and Signature (Right) */}
              <div className="pt-2 mt-auto">
                <div className="grid grid-cols-2 gap-4 items-end">
                  {/* Left Column */}
                  <div className="text-[9pt] leading-snug text-left">
                    <div className="font-bold">To</div>
                    <div>The Registrar of Trade Marks,</div>
                    <div>The Office of the Trade Marks Registry,</div>
                    <div className="font-semibold text-[8.5pt] tracking-wider text-slate-800">
                      {formData.jurisdiction}
                    </div>
                    {formData.hasLegalizationNote && (
                      <div className="mt-2 font-bold text-[8.5pt] tracking-wider text-slate-700">
                        NO LEGALIZATION NECESSARY
                      </div>
                    )}
                  </div>

                  {/* Right Column: Signature Block */}
                  <div className="text-right text-[9.5pt]">
                    <div className="inline-block text-left min-w-[220px]">
                      <div className="flex items-center justify-between text-slate-700 min-h-[36px]">
                        <span className="font-medium">Signature :</span>
                        {formData.signatureImage ? (
                          <img
                            src={formData.signatureImage}
                            alt="Signatory Signature"
                            className="h-9 max-w-[130px] object-contain ml-2"
                          />
                        ) : (
                          <span className="font-mono text-slate-400">____________________</span>
                        )}
                      </div>

                      <div className="mt-1 flex items-baseline justify-between gap-1">
                        <span className="text-[8.8pt] text-slate-600">Name of Signatory:</span>
                        <span className="font-bold text-[9.2pt] uppercase tracking-wide text-slate-950">
                          {formData.signatoryName}
                        </span>
                      </div>

                      <div className="mt-0.5 flex items-baseline justify-between gap-1">
                        <span className="text-[8.8pt] text-slate-600">Designation :</span>
                        <span className="font-bold text-[8.8pt] uppercase tracking-wider text-slate-900">
                          {formData.signatoryDesignation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Free Draft Mode: Preserves exact formatting and line breaks */
            <div className="flex-1 whitespace-pre-wrap font-serif text-[10pt] leading-relaxed text-slate-900 select-text text-left">
              {freeDraftText}
            </div>
          )}
        </div>

        {/* Overflow indicator in corner during drafting (hidden in PDF export) */}
        {isOverflowing && (
          <div className="no-print absolute top-2 right-2 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1 z-20">
            <span>⚠️ Exceeds 1-Page! Click &quot;Auto-Fit&quot;</span>
          </div>
        )}
      </div>
    </div>
  );
};
