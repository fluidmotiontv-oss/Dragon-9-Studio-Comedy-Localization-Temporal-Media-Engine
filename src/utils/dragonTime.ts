import { Dragon9TimeData } from "../types";

export const DRAGON_CYCLE_NAMES = [
  "Genesis Ignition",
  "Fluid Harmonic",
  "Resonant Sync",
  "Cadence Flux",
  "Solar Apex",
  "Kinetic Beat",
  "Neural Flow",
  "Dimensional Surge",
  "Dragon Synthesis",
];

/**
 * Computes the Dragon 9 Synchronized Time from Gregorian time.
 * In Dragon 9 temporal theory:
 * - 1 Dragon Hour = 54 standard minutes = 3,240 seconds
 * - 1 Dragon Beat = 6 standard minutes (9 beats per Dragon Hour)
 * - 1 Day has 24 * 60 = 1440 standard minutes
 * - Day is subdivided into 26.666 Dragon Hours, cycling in 9-Hour Harmonic Octaves
 */
export function calculateDragon9Time(date: Date = new Date()): Dragon9TimeData {
  // Total seconds elapsed today since midnight
  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);
  const totalSecondsToday = (date.getTime() - midnight.getTime()) / 1000;

  const secondsPerDragonHour = 54 * 60; // 3240s
  const totalDragonHoursToday = totalSecondsToday / secondsPerDragonHour;

  // Cycle within 1-9
  const rawHour = (Math.floor(totalDragonHoursToday) % 9) + 1;
  const secondsIntoCurrentHour = totalSecondsToday % secondsPerDragonHour;

  const dragonMinute = Math.floor(secondsIntoCurrentHour / 60);
  const dragonSecond = Math.floor(secondsIntoCurrentHour % 60);

  // 9 beats per 54-minute hour => each beat is 6 minutes = 360 seconds
  const dragonBeat = Math.min(8, Math.floor(secondsIntoCurrentHour / 360));

  const cycleName = DRAGON_CYCLE_NAMES[rawHour - 1] || "Dragon Harmonizer";
  const cycleProgressPct = Math.round((secondsIntoCurrentHour / secondsPerDragonHour) * 100);

  // Harmonic resonance base 432Hz scaled to 9-beat interval
  const harmonicFreqHz = Math.round(432 * (1 + dragonBeat * 0.054));

  const gregorianFormatted = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    gregorianFormatted,
    dragonHour: rawHour,
    dragonMinute,
    dragonSecond,
    dragonBeat,
    cycleName,
    cycleProgressPct,
    harmonicFreqHz,
  };
}
