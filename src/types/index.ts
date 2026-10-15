export interface StampConfig {
  serialNumber: string;
  stampDate: string; // e.g. "13 OCT 2026"
  state: string; // "UTTAR PRADESH"
  stateHindi: string; // "उत्तर प्रदेश"
  denomination: number; // 500
  showPerforations: boolean;
  bgMode: 'authentic_vector' | 'custom_upload';
  customBgImage: string | null;
  // Calibration offsets for custom uploaded stamp paper
  customDateX: number; // percent
  customDateY: number; // percent
  customNumberX: number; // percent
  customNumberY: number; // percent
}

export interface TM48FormData {
  applicantName: string;
  applicantAddress: string;
  agentName: string;
  agentCode: string;
  agentAddress: string;
  datedDay: string;
  datedMonth: string;
  datedYear: string;
  jurisdiction: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatureImage: string | null;
  hasLegalizationNote: boolean;
}

export interface DraftLayout {
  topOffsetMm: number;
  fontSizePt: number;
  lineHeight: number;
  fontFamily: 'EB Garamond' | 'Times New Roman' | 'Georgia' | 'Tinos' | 'Arial';
  leftMarginMm: number;
  rightMarginMm: number;
  bottomMarginMm: number;
  textAlign: 'justify' | 'left';
}

export interface DraftConfig {
  mode: 'form_tm48' | 'free_draft';
  formData: TM48FormData;
  freeDraftText: string;
  layout: DraftLayout;
}

export interface PresetTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  stampConfig: Partial<StampConfig>;
  formData: Partial<TM48FormData>;
  freeDraftText: string;
}
