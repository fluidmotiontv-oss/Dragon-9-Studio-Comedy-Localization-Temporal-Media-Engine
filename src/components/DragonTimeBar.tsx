import React, { useState, useEffect } from "react";
import { Clock, Radio, Sparkles, Compass, HelpCircle, Activity } from "lucide-react";
import { calculateDragon9Time } from "../utils/dragonTime";
import { Dragon9TimeData } from "../types";

interface DragonTimeBarProps {
  onOpenTheory: () => void;
}

export const DragonTimeBar: React.FC<DragonTimeBarProps> = ({ onOpenTheory }) => {
  const [timeData, setTimeData] = useState<Dragon9TimeData>(() => calculateDragon9Time());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeData(calculateDragon9Time());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const paddedDragonHour = String(timeData.dragonHour).padStart(2, "0");
  const paddedDragonMinute = String(timeData.dragonMinute).padStart(2, "0");
  const paddedDragonSecond = String(timeData.dragonSecond).padStart(2, "0");

  return (
    <header className="border-b border-amber-500/20 bg-[#0c0f17]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-red-600 to-purple-800 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-[#0d1019] rounded-[10px] flex items-center justify-center">
              <span className="font-serif font-black text-lg bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                D9
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white font-serif">
                Dragon 9 Studio
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                54-Min Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block truncate">
              Synchronized Time & Comedy Localization Engine
            </p>
          </div>
        </div>

        {/* Real-time Dragon 9 Clock Widget */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* 54-Min Harmonic Live Ticker */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute opacity-75"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500 relative"></span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase hidden md:inline">
                D9 Clock:
              </span>
            </div>

            <div className="flex items-baseline gap-1 font-mono font-bold text-amber-300 text-sm sm:text-base">
              <span>{paddedDragonHour}</span>
              <span className="text-amber-500/60">:</span>
              <span>{paddedDragonMinute}</span>
              <span className="text-amber-500/60">:</span>
              <span className="text-xs text-amber-400/80">{paddedDragonSecond}</span>
            </div>

            {/* Micro Beat indicator */}
            <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-slate-700/60 text-xs">
              <span className="text-slate-400 font-mono">Beat</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono font-bold">
                {timeData.dragonBeat + 1}/9
              </span>
              <span className="text-slate-400 text-[11px] truncate max-w-[110px]">
                {timeData.cycleName}
              </span>
            </div>

            {/* Hour Progress Bar */}
            <div className="w-12 sm:w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-1000"
                style={{ width: `${timeData.cycleProgressPct}%` }}
                title={`${timeData.cycleProgressPct}% through current 54-min cycle`}
              />
            </div>
          </div>

          {/* Gregorian reference */}
          <div className="hidden xl:flex flex-col text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400">Gregorian</span>
            <span className="text-xs font-mono text-slate-300">{timeData.gregorianFormatted}</span>
          </div>

          {/* Theory Modal Trigger */}
          <button
            onClick={onOpenTheory}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            title="Explore 54-Minute Hour Temporal Mathematics"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Temporal Theory</span>
          </button>
        </div>
      </div>
    </header>
  );
};
