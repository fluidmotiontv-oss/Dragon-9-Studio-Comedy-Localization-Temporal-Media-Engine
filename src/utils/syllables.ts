/**
 * Syllable counter heuristic for Latin & Japanese scripts.
 */
export function estimateSyllables(text: string, language: string = "EN"): number {
  if (!text) return 0;

  // Clean timing tags first: [pause: 0.5s] etc.
  const clean = text.replace(/\[pause:\s*[\d.]+s\]/gi, "").trim();
  if (!clean) return 0;

  // Japanese mora / syllabary count:
  // Kanji, Hiragana, Katakana roughly map to morae
  if (language === "JA" || /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(clean)) {
    // Each kana character is 1 mora; kanji roughly 2 morae average
    let morae = 0;
    for (const char of clean) {
      if (/[\u3040-\u309f\u30a0-\u30ff]/.test(char)) {
        // Small kana like ゃ ゅ ょ ッ combine or take half
        if (/[ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ]/.test(char)) {
          // slight variation
          morae += 0.5;
        } else {
          morae += 1;
        }
      } else if (/[\u4e00-\u9faf]/.test(char)) {
        morae += 2; // on'yomi/kun'yomi average ~2
      } else if (/[a-zA-Z0-9]/.test(char)) {
        morae += 0.5;
      }
    }
    return Math.max(1, Math.round(morae));
  }

  // Western languages heuristic:
  const words = clean.toLowerCase().split(/\s+/).filter(Boolean);
  let total = 0;

  for (const word of words) {
    const stripped = word.replace(/[^a-zäöüßáéíóúñàèìòùâêîôû]/g, "");
    if (stripped.length <= 3) {
      total += 1;
      continue;
    }
    // Count vowel groups
    const matches = stripped.match(/[aeiouyäöüáéíóúàèìòùâêîôû]+/g);
    let count = matches ? matches.length : 1;

    // Silent 'e' at end in English/French
    if ((language === "EN" || language === "FR") && stripped.endsWith("e") && !stripped.endsWith("le")) {
      count = Math.max(1, count - 1);
    }
    total += Math.max(1, count);
  }

  return total;
}

/**
 * Validates whether the localized syllable count falls within +/- 15% budget.
 */
export function checkCadenceBudget(sourceSyllables: number, targetSyllables: number): {
  diffPct: number;
  isWithinBudget: boolean;
  statusText: string;
  badgeColor: string;
} {
  if (sourceSyllables === 0 || targetSyllables === 0) {
    return {
      diffPct: 0,
      isWithinBudget: true,
      statusText: "Aligned",
      badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50",
    };
  }

  const diffPct = Math.round(((targetSyllables - sourceSyllables) / sourceSyllables) * 100);
  const isWithinBudget = Math.abs(diffPct) <= 15;

  if (isWithinBudget) {
    return {
      diffPct,
      isWithinBudget: true,
      statusText: `Exact Cadence (${diffPct >= 0 ? `+${diffPct}` : diffPct}%)`,
      badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50",
    };
  }

  return {
    diffPct,
    isWithinBudget: false,
    statusText: `Budget Variance (${diffPct >= 0 ? `+${diffPct}` : diffPct}%)`,
    badgeColor: "text-amber-400 bg-amber-950/40 border-amber-800/50",
  };
}

/**
 * Extracts the operative final word of the punchline for the Last-Word Punchline rule.
 */
export function extractTerminalWord(text: string): string {
  const clean = text.replace(/\[pause:\s*[\d.]+s\]/gi, "").trim();
  const words = clean.split(/[\s,.;:!?¡¿—\-]+/).filter(Boolean);
  return words.length > 0 ? words[words.length - 1] : "";
}
