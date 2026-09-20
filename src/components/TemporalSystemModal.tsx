import React from "react";
import { X, Clock, Zap, Music, BookOpen, CheckCircle2 } from "lucide-react";
import { DRAGON_CYCLE_NAMES } from "../utils/dragonTime";

interface TemporalSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemporalSystemModal: React.FC<TemporalSystemModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1422] border border-amber-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200 p-6 sm:p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-wide">
              The Dragon 9 Temporal System & The 54-Minute Hour
            </h2>
            <p className="text-xs sm:text-sm text-amber-400/80 font-mono">
              Synchronized Alternative Time • Equivalence of Comedic Cadence • Fluid Media
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          {/* Section 1: The Equation */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Zap className="w-4 h-4" />
              <span>Core Mathematical Formulation</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              Standard 60-minute mechanical time was created during the Industrial Revolution to enforce clock-punching in steam factories. The <strong>Dragon 9 Framework</strong> reorganizes time around human neurobiology:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-black/40 border border-amber-500/20 text-center">
                <span className="block text-2xl font-mono font-black text-amber-400">54 Min</span>
                <span className="text-xs text-slate-400 font-mono">1 Dragon Hour (3,240s)</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-amber-500/20 text-center">
                <span className="block text-2xl font-mono font-black text-amber-400">9 Beats</span>
                <span className="text-xs text-slate-400 font-mono">6 Minutes Per Harmonic Beat</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-amber-500/20 text-center">
                <span className="block text-2xl font-mono font-black text-amber-400">6 Min Buffer</span>
                <span className="text-xs text-slate-400 font-mono">Bio-Harmonic Cognitive Reset</span>
              </div>
            </div>
          </div>

          {/* Section 2: Why Stand-Up Comedy Localization Requires Synchronized Timing */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Music className="w-4 h-4" />
              <span>Comedic Cadence & Structural Synchronization</span>
            </div>
            <p className="text-xs sm:text-sm">
              Stand-up comedy is not linguistic translation—it is an <strong>acoustic percussion engine</strong>. A joke lands because of the tension curve, the micro-pause, and the exact syllable landing at the end of the phrase.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Syllable Budget (+/- 15%):</strong> If an English punchline has 14 syllables, the German or Japanese adaptation must hit 12–16 syllables to sustain identical rhythm.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Last-Word Punchline Rule:</strong> The operative revelation word must be the terminal token. If the word is "contraband", placing it in the middle ruins the cognitive release.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Hyper-Local Cultural Substitution:</strong> Swapping Trader Joe’s for Aldi Nord (DE), Monoprix (FR), Mercadona (ES), or Don Quijote (JA) keeps the social absurdity instant and resonant.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: The 9 Harmonic Octave Cycles */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2">
              <BookOpen className="w-4 h-4" />
              <span>The 9 Harmonic Hour Cycles</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {DRAGON_CYCLE_NAMES.map((name, i) => (
                <div key={name} className="p-2 rounded bg-slate-800/60 border border-slate-700/50 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span className="truncate text-slate-300">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
};
