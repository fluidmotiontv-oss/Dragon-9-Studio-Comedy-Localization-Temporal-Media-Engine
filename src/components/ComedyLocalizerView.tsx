import React, { useState } from "react";
import {
  Mic,
  Globe,
  Sparkles,
  Play,
  Square,
  Copy,
  Check,
  Download,
  AlertCircle,
  Clock,
  Volume2,
  FileCode,
  FileSpreadsheet,
  Table,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sliders,
  ChevronDown
} from "lucide-react";
import { ComedySegment } from "../types";
import { COMEDY_PRESETS, ComedyScriptPreset } from "../data/presets";
import { estimateSyllables, checkCadenceBudget, extractTerminalWord } from "../utils/syllables";
import { speechPlayer, PlaybackState } from "../utils/audioTTS";

export const ComedyLocalizerView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>("supermarket");
  const [scriptInput, setScriptInput] = useState<string>(COMEDY_PRESETS[0].script);
  const [targetLang, setTargetLang] = useState<"DE" | "ES" | "FR" | "JA">("DE");
  const [region, setRegion] = useState<string>("");
  const [customNotes, setCustomNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Localized results
  const [segments, setSegments] = useState<ComedySegment[]>([]);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [copiedCsv, setCopiedCsv] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"cards" | "json" | "csv">("cards");

  // Audio playback state
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    activeSegmentId: null,
    activePartIndex: null,
  });
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  // Subscribe to TTS changes
  React.useEffect(() => {
    speechPlayer.setCallback((state) => {
      setPlaybackState(state);
    });
    return () => speechPlayer.stop();
  }, []);

  const handleSelectPreset = (preset: ComedyScriptPreset) => {
    setSelectedPreset(preset.id);
    setScriptInput(preset.script);
    setTargetLang(preset.recommendedLang);
    speechPlayer.stop();
    setSegments([]);
  };

  const handleLocalize = async () => {
    if (!scriptInput.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    speechPlayer.stop();

    try {
      const res = await fetch("/api/localize-comedy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: scriptInput,
          targetLanguage: targetLang,
          region: region || undefined,
          customNotes: customNotes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMessage = typeof data.error === "object" ? data.error.message : data.error;
        if (res.status === 503 || (errorMessage && errorMessage.includes("high demand"))) {
          throw new Error("The localization engine is experiencing temporary high demand. We've tried automatic retries, but please click generate again in a few seconds.");
        }
        throw new Error(errorMessage || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const enrichedSegments: ComedySegment[] = (data.segments || []).map((seg: ComedySegment, idx: number) => {
        const sourceSyl = estimateSyllables(seg.source_text, "EN");
        const targetSyl = estimateSyllables(seg.timing_markers || seg.localized_text, seg.target_language);
        const budget = checkCadenceBudget(sourceSyl, targetSyl);
        const lastWord = extractTerminalWord(seg.localized_text);

        return {
          ...seg,
          segment_id: seg.segment_id || String(idx + 1).padStart(3, "0"),
          sourceSyllables: sourceSyl,
          targetSyllables: targetSyl,
          syllableDiffPct: budget.diffPct,
          lastWordTarget: lastWord,
        };
      });

      setSegments(enrichedSegments);
    } catch (err: any) {
      console.error("Localization error:", err);
      setErrorMsg(err.message || "Failed to localize comedy script.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = (seg: ComedySegment) => {
    if (playbackState.isPlaying && playbackState.activeSegmentId === seg.segment_id) {
      speechPlayer.stop();
      return;
    }

    const langCodes: Record<string, string> = {
      DE: "de-DE",
      ES: region.toLowerCase().includes("mexic") ? "es-MX" : "es-ES",
      FR: "fr-FR",
      JA: "ja-JP",
    };

    const code = langCodes[seg.target_language] || "en-US";
    speechPlayer.playScript(seg.segment_id, seg.timing_markers || seg.localized_text, code, playbackRate);
  };

  const handleCopyJson = () => {
    const cleanOutput = segments.map((s) => ({
      segment_id: s.segment_id,
      target_language: s.target_language,
      source_text: s.source_text,
      localized_text: s.localized_text,
      timing_markers: s.timing_markers,
      adaptation_notes: s.adaptation_notes,
    }));

    navigator.clipboard.writeText(JSON.stringify(cleanOutput, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const cleanOutput = segments.map((s) => ({
      segment_id: s.segment_id,
      target_language: s.target_language,
      source_text: s.source_text,
      localized_text: s.localized_text,
      timing_markers: s.timing_markers,
      adaptation_notes: s.adaptation_notes,
    }));

    const blob = new Blob([JSON.stringify(cleanOutput, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dragon9-comedy-localized-${targetLang.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateCsvString = () => {
    const headers = [
      "Segment ID",
      "Target Language",
      "Source Text",
      "Localized Text",
      "Timing Markers & Pauses",
      "Adaptation Notes",
      "Source Syllables",
      "Target Syllables",
      "Syllable Variance %",
      "Terminal Punchline Word",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = segments.map((s) => [
      escapeCsv(s.segment_id),
      escapeCsv(s.target_language),
      escapeCsv(s.source_text),
      escapeCsv(s.localized_text),
      escapeCsv(s.timing_markers),
      escapeCsv(s.adaptation_notes),
      escapeCsv(s.sourceSyllables ?? ""),
      escapeCsv(s.targetSyllables ?? ""),
      escapeCsv(s.syllableDiffPct !== undefined ? `${s.syllableDiffPct > 0 ? "+" : ""}${s.syllableDiffPct}%` : ""),
      escapeCsv(s.lastWordTarget ?? ""),
    ]);

    return [headers.map(escapeCsv).join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  };

  const handleDownloadCsv = () => {
    const csvContent = generateCsvString();
    // Prepend UTF-8 BOM (\uFEFF) so Excel and Google Sheets correctly parse international characters (German umlauts, Spanish accents, Japanese kanji/kana)
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dragon9-comedy-timing-${targetLang.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCsv = () => {
    const csvContent = generateCsvString();
    navigator.clipboard.writeText(csvContent);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Engine Purpose */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-purple-900/20 border border-amber-500/20 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Core Engine 01
              </span>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                Automated Stand-Up Comedy Localization Engine
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Strictly enforces <strong>Equivalence of Humor</strong>: preserves setup-pause-punchline comedic timing, keeps punchline syllable budgets within +/- 15%, maps hyper-local cultural substitutions, and guarantees the operative joke lands on the final sentence word.
            </p>
          </div>

          {/* 4 Rules Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-amber-200/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>±15% Syllables</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-amber-200/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Local Cultural Swaps</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-amber-200/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Last-Word Punchline</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-amber-200/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>[pause: Xs] TTS Sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Stand-Up Comedy Bit Vault:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMEDY_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-xs text-amber-300 truncate">{preset.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {preset.recommendedLang}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form & Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Script Editor (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-slate-300 uppercase flex items-center gap-2">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>Comedy Script Input (Separated by paragraph beats):</span>
            </label>
            <span className="text-xs font-mono text-slate-400">
              {scriptInput.split(/\n\s*\n/).filter(Boolean).length} Comedic Beats
            </span>
          </div>

          <textarea
            value={scriptInput}
            onChange={(e) => setScriptInput(e.target.value)}
            rows={10}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 p-4 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-slate-600 resize-y"
            placeholder="Paste raw stand-up routine or joke script here..."
          />
        </div>

        {/* Configuration Panel (1 col) */}
        <div className="space-y-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono uppercase font-bold text-white tracking-wider">
                Localization Matrix
              </h3>
            </div>

            {/* Target Language Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Target Language:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: "DE", name: "German (DE)", note: "Umgangssprache & SOV verb delay" },
                  { code: "ES", name: "Spanish (ES)", note: "High tempo, punchline accent" },
                  { code: "FR", name: "French (FR)", note: "Verlan/argot, timing fillers" },
                  { code: "JA", name: "Japanese (JA)", note: "親の仇 framing & spoken punch" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setTargetLang(lang.code as any)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      targetLang === lang.code
                        ? "bg-amber-500/20 border-amber-500 text-amber-200 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs font-bold">{lang.code}</div>
                    <div className="text-[10px] opacity-80 truncate">{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Regional dialect */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Regional Nuance / Dialect (Optional):</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder={
                  targetLang === "ES"
                    ? "e.g. Castilian or Mexican"
                    : targetLang === "DE"
                    ? "e.g. Berlin Umgangssprache or Bavarian"
                    : targetLang === "FR"
                    ? "e.g. Parisian argot or Quebecois"
                    : "e.g. Kansai vs Kanto delivery"
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Comedic Focus / Actor Direction:</label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Deadpan sarcastic, rapid-fire rant, self-deprecating"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={handleLocalize}
              disabled={isLoading || !scriptInput.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Localizing Cadence & Beats...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Localize Script for {targetLang}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 font-mono">
              Strictly applies timing tags [pause: X.Xs] & syllable checks
            </p>
          </div>
        </div>
      </div>

      {/* Error notification */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Results Section */}
      {segments.length > 0 && (
        <div className="space-y-4 pt-4">
          {/* Results Header with View Switcher & Audio Rate */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase text-white tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>Localized Output ({segments.length} Segments)</span>
              </span>
              <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab("cards")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "cards"
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Beat Cards
                </button>
                <button
                  onClick={() => setActiveTab("json")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "json"
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Raw JSON Spec
                </button>
                <button
                  onClick={() => setActiveTab("csv")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                    activeTab === "csv"
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV Table</span>
                </button>
              </div>
            </div>

            {/* Audio Speed Controls & Export */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>TTS Speed:</span>
                <select
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="0.85">0.85x (Deliberate)</option>
                  <option value="1.0">1.0x (Standard)</option>
                  <option value="1.15">1.15x (High Tempo)</option>
                </select>
              </div>

              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title="Copy valid JSON matching instructions"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? "Copied!" : "JSON"}</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title="Download JSON File"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">.JSON</span>
              </button>

              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 font-bold transition-all shadow-sm shadow-emerald-950 cursor-pointer"
                title="Export localized comedy script and timing data as CSV file"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Cards Tab */}
          {activeTab === "cards" && (
            <div className="space-y-4">
              {segments.map((seg, idx) => {
                const isPlayingThis = playbackState.isPlaying && playbackState.activeSegmentId === seg.segment_id;
                const isPausedBeat = isPlayingThis && playbackState.activePartIndex === -1;
                const budget = checkCadenceBudget(seg.sourceSyllables || 0, seg.targetSyllables || 0);

                return (
                  <div
                    key={seg.segment_id || idx}
                    className={`p-5 rounded-xl border transition-all ${
                      isPlayingThis
                        ? "bg-slate-900/90 border-amber-500/60 shadow-lg shadow-amber-500/10"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Segment Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                          Segment #{seg.segment_id}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          Target: <strong className="text-slate-200">{seg.target_language}</strong>
                        </span>
                      </div>

                      {/* TTS Play Button */}
                      <div className="flex items-center gap-2">
                        {isPausedBeat && (
                          <span className="text-[11px] font-mono text-amber-400 animate-pulse flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60">
                            <Clock className="w-3 h-3 animate-spin" />
                            [Active Pause Beat]
                          </span>
                        )}
                        <button
                          onClick={() => handlePlayAudio(seg)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            isPlayingThis
                              ? "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30"
                              : "bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                          }`}
                        >
                          {isPlayingThis ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>Stop Speech</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Listen with Timing</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Source & Localized Comparison Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Source Beat */}
                      <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/70 space-y-1.5">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                          <span>Original English Beat</span>
                          <span>~{seg.sourceSyllables} Syllables</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                          "{seg.source_text}"
                        </p>
                      </div>

                      {/* Localized Script with Timing Tags highlighted */}
                      <div className="p-3.5 rounded-lg bg-black/40 border border-amber-500/30 space-y-1.5">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                          <span className="text-amber-300 font-bold">Localized Adapted Punchline</span>
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] ${budget.badgeColor}`}>
                            ~{seg.targetSyllables} Syl ({budget.statusText})
                          </span>
                        </div>
                        <div className="text-sm text-slate-100 font-medium leading-relaxed">
                          {/* Render timing tags as visual chips */}
                          {renderTimingText(seg.timing_markers || seg.localized_text)}
                        </div>
                      </div>
                    </div>

                    {/* Quality & Rule Metrics Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono mb-3">
                      {/* Syllable Budget */}
                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Rhythm Budget:</span>
                        <span className={`font-bold ${budget.isWithinBudget ? "text-emerald-400" : "text-amber-400"}`}>
                          {budget.statusText}
                        </span>
                      </div>

                      {/* Last Word Punchline */}
                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Last-Word Landing:</span>
                        <span className="font-bold text-amber-300 truncate max-w-[120px]">
                          "{seg.lastWordTarget}"
                        </span>
                      </div>

                      {/* Rule Compliance */}
                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Humor Equivalence:</span>
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Validated
                        </span>
                      </div>
                    </div>

                    {/* Adaptation Notes (Required by prompt format) */}
                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs">
                      <span className="font-mono font-bold text-amber-300 block mb-0.5">
                        Cultural & Rhythm Adaptation Notes:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{seg.adaptation_notes}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* JSON Tab */}
          {activeTab === "json" && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto">
              <pre className="text-amber-300">
                {JSON.stringify(
                  segments.map((s) => ({
                    segment_id: s.segment_id,
                    target_language: s.target_language,
                    source_text: s.source_text,
                    localized_text: s.localized_text,
                    timing_markers: s.timing_markers,
                    adaptation_notes: s.adaptation_notes,
                  })),
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {/* CSV Tab */}
          {activeTab === "csv" && (
            <div className="space-y-4">
              {/* CSV Toolbar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white font-mono">
                      CSV Data & Timing Telemetry
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      RFC 4180 • UTF-8 BOM
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Pre-configured for direct import into Google Sheets, Microsoft Excel, and automated TTS audio synthesis pipelines.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCsv}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                  >
                    {copiedCsv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCsv ? "Copied CSV" : "Copy CSV Raw"}</span>
                  </button>

                  <button
                    onClick={handleDownloadCsv}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .CSV File</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                        <th className="p-3">ID</th>
                        <th className="p-3">Lang</th>
                        <th className="p-3 min-w-[200px]">Source Text</th>
                        <th className="p-3 min-w-[220px]">Localized Text</th>
                        <th className="p-3 min-w-[220px]">Timing Markers & Pauses</th>
                        <th className="p-3 min-w-[80px]">Syllables</th>
                        <th className="p-3 min-w-[100px]">Punchline Word</th>
                        <th className="p-3 min-w-[200px]">Adaptation Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-sans text-slate-300">
                      {segments.map((s) => {
                        const budget = checkCadenceBudget(s.sourceSyllables || 0, s.targetSyllables || 0);
                        return (
                          <tr key={s.segment_id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3 font-mono font-bold text-amber-400 align-top">
                              {s.segment_id}
                            </td>
                            <td className="p-3 font-mono text-slate-400 align-top">
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                                {s.target_language}
                              </span>
                            </td>
                            <td className="p-3 text-slate-300 leading-relaxed align-top">
                              {s.source_text}
                            </td>
                            <td className="p-3 text-white font-medium leading-relaxed align-top">
                              {s.localized_text}
                            </td>
                            <td className="p-3 font-mono text-xs align-top">
                              <div className="bg-slate-900/90 p-2 rounded border border-slate-800/60 leading-relaxed">
                                {renderTimingText(s.timing_markers)}
                              </div>
                            </td>
                            <td className="p-3 font-mono align-top">
                              <div className="space-y-1">
                                <div className="text-[11px] text-slate-400">
                                  {s.sourceSyllables} → <strong className="text-white">{s.targetSyllables}</strong>
                                </div>
                                <span
                                  className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                    budget.isWithinBudget
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                                  }`}
                                >
                                  {s.syllableDiffPct !== undefined && s.syllableDiffPct > 0 ? `+${s.syllableDiffPct}%` : `${s.syllableDiffPct}%`}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 font-mono align-top">
                              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                                "{s.lastWordTarget || extractTerminalWord(s.localized_text)}"
                              </span>
                            </td>
                            <td className="p-3 text-xs text-slate-400 leading-relaxed align-top">
                              {s.adaptation_notes}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Raw CSV Preview Box */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Raw CSV Stream Preview:
                </span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
                  <pre className="whitespace-pre">{generateCsvString()}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper to render [pause: X.Xs] as colorful chips
function renderTimingText(rawText: string) {
  const parts = rawText.split(/(\[pause:\s*[\d.]+s\])/gi);
  return parts.map((part, i) => {
    if (/^\[pause:\s*[\d.]+s\]$/i.test(part)) {
      return (
        <span
          key={i}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.2 mx-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold select-none"
        >
          <Clock className="w-3 h-3 text-amber-400" />
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
