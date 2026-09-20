/**
 * Web Speech API synthesizer that respects [pause: X.Xs] timing markers.
 */

export interface PlaybackState {
  isPlaying: boolean;
  activeSegmentId: string | null;
  activePartIndex: number | null;
}

export type PlaybackCallback = (state: PlaybackState) => void;

class ComedySpeechPlayer {
  private isCancelled = false;
  private currentTimeout: any = null;
  private onStateChange: PlaybackCallback | null = null;

  public setCallback(cb: PlaybackCallback) {
    this.onStateChange = cb;
  }

  public stop() {
    this.isCancelled = true;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.notifyState(false, null, null);
  }

  private notifyState(isPlaying: boolean, segmentId: string | null, partIndex: number | null) {
    if (this.onStateChange) {
      this.onStateChange({ isPlaying, activeSegmentId: segmentId, activePartIndex: partIndex });
    }
  }

  public async playScript(
    segmentId: string,
    timingText: string,
    langCode: string = "de-DE",
    rate: number = 1.0
  ): Promise<void> {
    this.stop();
    this.isCancelled = false;

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Web Speech API not supported in this environment.");
      return;
    }

    // Split timingText by [pause: X.Xs] tags while keeping track of durations
    // e.g. "Setup text [pause: 0.8s] punchline text!"
    const regex = /\[pause:\s*([\d.]+)s\]/gi;
    const parts: { text: string; pauseAfterMs: number }[] = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(timingText)) !== null) {
      const chunkText = timingText.substring(lastIndex, match.index).trim();
      const pauseDurationSec = parseFloat(match[1]) || 0.5;
      parts.push({
        text: chunkText,
        pauseAfterMs: Math.round(pauseDurationSec * 1000),
      });
      lastIndex = regex.lastIndex;
    }

    // Remaining text after last pause tag
    if (lastIndex < timingText.length) {
      const remaining = timingText.substring(lastIndex).trim();
      if (remaining) {
        parts.push({ text: remaining, pauseAfterMs: 0 });
      }
    }

    // If no pauses found, whole text is 1 part
    if (parts.length === 0 && timingText.trim()) {
      parts.push({ text: timingText.trim(), pauseAfterMs: 0 });
    }

    this.notifyState(true, segmentId, 0);

    for (let i = 0; i < parts.length; i++) {
      if (this.isCancelled) break;
      const part = parts[i];

      if (part.text) {
        this.notifyState(true, segmentId, i);
        await this.speakUtterance(part.text, langCode, rate);
      }

      if (this.isCancelled) break;

      // Honor the comedic pause!
      if (part.pauseAfterMs > 0 && i < parts.length - 1) {
        this.notifyState(true, segmentId, -1); // -1 signifies active pause beat
        await new Promise((resolve) => {
          this.currentTimeout = setTimeout(resolve, part.pauseAfterMs);
        });
      }
    }

    this.stop();
  }

  private speakUtterance(text: string, langCode: string, rate: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.isCancelled) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = rate;

      // Find matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const targetLangPrefix = langCode.split("-")[0].toLowerCase();
      const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLangPrefix));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn("TTS Utterance error:", e);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const speechPlayer = new ComedySpeechPlayer();
