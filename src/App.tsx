import React, { useState } from "react";
import { Mic, Sparkles, BookOpen, Layers, HelpCircle, Activity, Clock } from "lucide-react";
import { DragonTimeBar } from "./components/DragonTimeBar";
import { ComedyLocalizerView } from "./components/ComedyLocalizerView";
import { MediaArchitectView } from "./components/MediaArchitectView";
import { TemporalSystemModal } from "./components/TemporalSystemModal";

export default function App() {
  const [activeView, setActiveView] = useState<"comedy" | "media">("comedy");
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#090b10] text-[#e2e8f0] flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Live Dragon 9 Synchronized Time Clock Bar */}
      <DragonTimeBar onOpenTheory={() => setIsTheoryOpen(true)} />

      {/* Main Studio Shell */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveView("comedy")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeView === "comedy"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Comedy Localization Engine</span>
            </button>

            <button
              onClick={() => setActiveView("media")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeView === "media"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-slate-950 shadow-md shadow-purple-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Digital Content Producer</span>
            </button>
          </div>

          {/* Quick Info / Mode Tag */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden md:inline">Temporal Harmonic Engine:</span>
            <span className="text-amber-300 font-bold">54-Min Synchronized Mode Active</span>
          </div>
        </div>

        {/* Studio Content */}
        {activeView === "comedy" ? <ComedyLocalizerView /> : <MediaArchitectView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#07090e] py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-400 font-bold">Dragon 9 Synchronized Time Studio</span>
            <span className="text-slate-600">|</span>
            <span>Equivalence of Humor & Fluid Media Architect</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTheoryOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              54-Min Harmonic Blueprint
            </button>
            <span>•</span>
            <span>Gemini 3.8 Flash Engine</span>
          </div>
        </div>
      </footer>

      {/* 54-Minute Hour & Temporal Philosophy Modal */}
      <TemporalSystemModal isOpen={isTheoryOpen} onClose={() => setIsTheoryOpen(false)} />
    </div>
  );
}
