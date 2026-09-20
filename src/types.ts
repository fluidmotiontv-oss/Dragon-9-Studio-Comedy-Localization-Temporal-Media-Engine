export interface ComedySegment {
  segment_id: string;
  target_language: string;
  source_text: string;
  localized_text: string;
  timing_markers: string;
  adaptation_notes: string;
  sourceSyllables?: number;
  targetSyllables?: number;
  syllableDiffPct?: number;
  lastWordTarget?: string;
}

export interface LocalizationResponse {
  segments: ComedySegment[];
  note?: string;
  error?: string;
}

export interface EbookChapter {
  chapterNumber: number;
  title: string;
  summary: string;
}

export interface EbookPackaging {
  title: string;
  subtitle: string;
  salesPitch: string;
  pricingStrategy: string;
  chapters: EbookChapter[];
}

export interface StorefrontCopy {
  headline: string;
  subheadline: string;
  heroBody: string;
  bulletBenefits: string[];
  callToAction: string;
  guaranteeNote: string;
}

export interface MediaScene {
  sceneNumber: number;
  audioCue: string;
  visualCue: string;
  voiceover: string;
  pacingNote: string;
}

export interface MediaScript {
  title: string;
  targetDuration: string;
  scenes: MediaScene[];
}

export interface SocialSnippet {
  platform: string;
  hook: string;
  body: string;
  hashtags: string[];
}

export interface MediaArchitectPackage {
  ebookPackaging: EbookPackaging;
  storefrontCopy: StorefrontCopy;
  mediaScript: MediaScript;
  socialSnippets: SocialSnippet[];
}

export interface Dragon9TimeData {
  gregorianFormatted: string;
  dragonHour: number;
  dragonMinute: number;
  dragonSecond: number;
  dragonBeat: number;
  cycleName: string;
  cycleProgressPct: number;
  harmonicFreqHz: number;
}
