import React, { useState } from "react";
import {
  BookOpen,
  ShoppingBag,
  Video,
  Share2,
  Sparkles,
  Copy,
  Check,
  Download,
  AlertCircle,
  Clock,
  Layers,
  CheckCircle2,
  Tag,
  DollarSign,
  Play,
  Volume2
} from "lucide-react";
import { MediaArchitectPackage } from "../types";
import { ESSAY_PRESETS, EssayPreset } from "../data/presets";
import { speechPlayer } from "../utils/audioTTS";

export const MediaArchitectView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>("dragon54");
  const [draftInput, setDraftInput] = useState<string>(ESSAY_PRESETS[0].draft);
  const [targetAudience, setTargetAudience] = useState<string>("digital creators, media architects, and deep-work practitioners");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result package
  const [packageData, setPackageData] = useState<MediaArchitectPackage | null>(null);
  const [activeDeliverable, setActiveDeliverable] = useState<"ebook" | "storefront" | "script" | "social">("ebook");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSelectPreset = (preset: EssayPreset) => {
    setSelectedPreset(preset.id);
    setDraftInput(preset.draft);
  };

  const handleGenerate = async () => {
    if (!draftInput.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/produce-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicOrDraft: draftInput,
          targetAudience,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMessage = typeof data.error === "object" ? data.error.message : data.error;
        if (res.status === 503 || (errorMessage && errorMessage.includes("high demand"))) {
          throw new Error("The AI production engine is currently experiencing high demand. We've attempted automatic retries, but please try again in a few moments if this continues.");
        }
        throw new Error(errorMessage || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setPackageData(data);
    } catch (err: any) {
      console.error("Media producer error:", err);
      setErrorMsg(err.message || "Failed to generate digital media architect package.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePlayVoiceover = (text: string, sceneNum: number) => {
    speechPlayer.playScript(`scene-${sceneNum}`, text, "en-US", 1.0);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-amber-950/20 border border-purple-500/20 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Core Engine 02
              </span>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                Digital Content Producer & Media Architect
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Takes raw drafts, academic essays, and core concepts (such as alternative temporal systems, the Dragon 9 54-minute hour, and fluid media frameworks) and translates them into ready-to-publish e-books, storefront copy, video scripts with atmospheric cues, and social snippets.
            </p>
          </div>

          {/* 4 Pillars Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-purple-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>E-Book Packaging</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-purple-200 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
              <span>Storefront Copy</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-purple-200 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-purple-400" />
              <span>Media Scripts</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-purple-200 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Promo Snippets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Select Draft or Academic Concept:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ESSAY_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-purple-500/10 border-purple-500/50 shadow-md shadow-purple-500/10 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="font-semibold text-xs sm:text-sm text-purple-300 mb-1">{preset.title}</div>
                <p className="text-xs text-slate-400 line-clamp-2">{preset.summary}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Draft Input Box */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <label className="text-xs font-mono text-slate-300 uppercase flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Raw Draft, Academic Essay, or Product Blueprint:</span>
            </label>
            <textarea
              value={draftInput}
              onChange={(e) => setDraftInput(e.target.value)}
              rows={9}
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 p-4 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder:text-slate-600 resize-y"
              placeholder="Paste raw essay, core concept, or notes here..."
            />
          </div>

          <div className="space-y-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-300 uppercase block">
                Target Audience & Tone:
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. digital creators, Payhip buyers, academic thinkers"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                <span className="font-bold text-slate-200 block">Production Output Includes:</span>
                <p>• E-Book Titles, Chapter Breakdowns & Pricing</p>
                <p>• High-converting Landing Page Copy & CTA</p>
                <p>• Audio/Video Scripts with [Audio Cue] & [Visual Cue]</p>
                <p>• Social Media Teasers & Viral Thread Hooks</p>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !draftInput.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-amber-500 hover:from-purple-400 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Architecting Media Deliverables...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Media Suite</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Output Deliverables Suite */}
      {packageData && (
        <div className="space-y-6 pt-4">
          {/* Deliverables Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
            {[
              { id: "ebook", label: "1. E-Book Packaging", icon: BookOpen },
              { id: "storefront", label: "2. Storefront Copy", icon: ShoppingBag },
              { id: "script", label: "3. Media Script & Cues", icon: Video },
              { id: "social", label: "4. Promotional Snippets", icon: Share2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDeliverable === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDeliverable(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* DELIVERABLE 1: E-BOOK PACKAGING */}
          {activeDeliverable === "ebook" && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase text-purple-400 font-bold">
                    Deliverable 01 • Payhip & Gumroad E-Book Architecture
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                    {packageData.ebookPackaging.title}
                  </h3>
                  <p className="text-sm text-slate-300 italic mt-0.5">
                    {packageData.ebookPackaging.subtitle}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleCopyText(
                      `${packageData.ebookPackaging.title}\n${packageData.ebookPackaging.subtitle}\n\nPITCH:\n${packageData.ebookPackaging.salesPitch}\n\nPRICING:\n${packageData.ebookPackaging.pricingStrategy}\n\nCHAPTERS:\n${packageData.ebookPackaging.chapters
                        .map((c) => `Chapter ${c.chapterNumber}: ${c.title} - ${c.summary}`)
                        .join("\n")}`,
                      "ebook"
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                >
                  {copiedKey === "ebook" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "ebook" ? "Copied" : "Copy E-Book Spec"}</span>
                </button>
              </div>

              {/* Pitch & Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Sales Pitch Summary:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {packageData.ebookPackaging.salesPitch}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Pricing & Monetization Strategy:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {packageData.ebookPackaging.pricingStrategy}
                  </p>
                </div>
              </div>

              {/* Chapter Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Chapter Architecture & Core Takeaways:</span>
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {packageData.ebookPackaging.chapters.map((chapter) => (
                    <div
                      key={chapter.chapterNumber}
                      className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-purple-500/30">
                        {chapter.chapterNumber}
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-slate-100 font-serif">
                          {chapter.title}
                        </h5>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {chapter.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DELIVERABLE 2: STOREFRONT COPY */}
          {activeDeliverable === "storefront" && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono uppercase text-purple-400 font-bold">
                  Deliverable 02 • High-Converting Storefront Landing Copy
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      `${packageData.storefrontCopy.headline}\n${packageData.storefrontCopy.subheadline}\n\n${packageData.storefrontCopy.heroBody}\n\nKEY BENEFITS:\n${packageData.storefrontCopy.bulletBenefits
                        .map((b) => `• ${b}`)
                        .join("\n")}\n\nCTA: ${packageData.storefrontCopy.callToAction}\nGUARANTEE: ${packageData.storefrontCopy.guaranteeNote}`,
                      "storefront"
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                >
                  {copiedKey === "storefront" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "storefront" ? "Copied" : "Copy Storefront Text"}</span>
                </button>
              </div>

              {/* Landing Page Preview Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-950 to-[#0f1422] border border-amber-500/30 space-y-6 shadow-2xl">
                <div className="max-w-2xl space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
                    {packageData.storefrontCopy.headline}
                  </h3>
                  <p className="text-sm sm:text-base text-amber-300/90 font-medium">
                    {packageData.storefrontCopy.subheadline}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {packageData.storefrontCopy.heroBody}
                </p>

                {/* Key Benefits */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                    What You Gain With Instant Digital Delivery:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {packageData.storefrontCopy.bulletBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Box */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <button className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.02]">
                    {packageData.storefrontCopy.callToAction}
                  </button>
                  <span className="text-xs text-slate-400 font-mono">
                    🛡️ {packageData.storefrontCopy.guaranteeNote}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* DELIVERABLE 3: MEDIA SCRIPTS WITH PRODUCTION BRACKETS */}
          {activeDeliverable === "script" && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase text-purple-400 font-bold">
                    Deliverable 03 • Audio/Video Production Script with Atmospheric Cues
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                    {packageData.mediaScript.title} ({packageData.mediaScript.targetDuration})
                  </h3>
                </div>

                <button
                  onClick={() =>
                    handleCopyText(
                      `${packageData.mediaScript.title} - ${packageData.mediaScript.targetDuration}\n\n${packageData.mediaScript.scenes
                        .map(
                          (s) =>
                            `SCENE ${s.sceneNumber}:\n${s.audioCue}\n${s.visualCue}\nVOICEOVER: "${s.voiceover}"\nPACING: ${s.pacingNote}\n`
                        )
                        .join("\n")}`,
                      "script"
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                >
                  {copiedKey === "script" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "script" ? "Copied" : "Copy Production Script"}</span>
                </button>
              </div>

              {/* Scene Breakdown */}
              <div className="space-y-4">
                {packageData.mediaScript.scenes.map((scene) => (
                  <div
                    key={scene.sceneNumber}
                    className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                        Scene {scene.sceneNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          Pacing: <strong className="text-slate-200">{scene.pacingNote}</strong>
                        </span>
                        <button
                          onClick={() => handlePlayVoiceover(scene.voiceover, scene.sceneNumber)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 transition-colors"
                          title="Preview voiceover audio"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Preview VO</span>
                        </button>
                      </div>
                    </div>

                    {/* Production Cues */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded bg-purple-950/30 border border-purple-800/40 text-purple-200">
                        <strong className="text-purple-400 block mb-0.5">Atmospheric Audio:</strong>
                        {scene.audioCue}
                      </div>
                      <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-200">
                        <strong className="text-amber-400 block mb-0.5">Visual Directives:</strong>
                        {scene.visualCue}
                      </div>
                    </div>

                    {/* Spoken Voiceover */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                        Spoken Voiceover:
                      </span>
                      <p className="text-sm font-medium text-slate-100 leading-relaxed font-serif">
                        "{scene.voiceover}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DELIVERABLE 4: SOCIAL SNIPPETS */}
          {activeDeliverable === "social" && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono uppercase text-purple-400 font-bold">
                  Deliverable 04 • Multi-Platform Promotional Snippets & Viral Hooks
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      packageData.socialSnippets
                        .map(
                          (s) =>
                            `[${s.platform.toUpperCase()}]\nHOOK: ${s.hook}\n${s.body}\n${s.hashtags.join(" ")}\n`
                        )
                        .join("\n"),
                      "social_all"
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                >
                  {copiedKey === "social_all" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "social_all" ? "Copied All" : "Copy All Snippets"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packageData.socialSnippets.map((snippet, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          {snippet.platform}
                        </span>
                        <button
                          onClick={() =>
                            handleCopyText(`${snippet.hook}\n\n${snippet.body}\n\n${snippet.hashtags.join(" ")}`, `social_${idx}`)
                          }
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                          title="Copy snippet"
                        >
                          {copiedKey === `social_${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-300">
                        "{snippet.hook}"
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {snippet.body}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-900 text-[10px] font-mono text-purple-400">
                      {snippet.hashtags.map((tag, tIdx) => (
                        <span key={tIdx}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
