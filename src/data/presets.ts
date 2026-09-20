export interface ComedyScriptPreset {
  id: string;
  title: string;
  description: string;
  script: string;
  recommendedLang: "DE" | "ES" | "FR" | "JA";
}

export const COMEDY_PRESETS: ComedyScriptPreset[] = [
  {
    id: "supermarket",
    title: "Supermarket Self-Checkout Psychosis",
    description: "Retail absurdity, self-scanners, hyper-local store swaps (Aldi, Monoprix, Mercadona, Donki).",
    recommendedLang: "DE",
    script: `I went into the organic supermarket yesterday because apparently I hate having money.

The automated self-checkout machine started looking at me like I'm an international art thief.

I gently put one single lime on the metal scale, and the robotic voice screamed at the entire store: "UNEXPECTED ITEM IN THE BAGGING AREA!"

Ma'am, it is a single citrus fruit!

Then the attendant walks over with her master key card, sighs with the cosmic weight of four generations of human misery, and scans the screen like she's defusing a radioactive bomb.`,
  },
  {
    id: "budget_airline",
    title: "Ultra-Budget Airline Surcharges",
    description: "Airport delays, punitive carry-on sizers, and absurd fees.",
    recommendedLang: "ES",
    script: `Have you flown on one of those extreme ultra-budget airlines recently?

They charge you thirty-five dollars just to inhale their cabin oxygen.

The gate agent glared at my little nylon backpack like I was trying to smuggle a grand piano onto the aircraft.

She said: "Sir, that bag does not fit into our metal testing frame."

I said: "Watch me kick it until its molecular structure collapses!"

And she smiled coldly: "That kick will be an eighty-euro athletic baggage surcharge!"`,
  },
  {
    id: "smart_home",
    title: "Smart Home Existential Breakdown",
    description: "Voice assistants questioning human reality and unexpected deliveries.",
    recommendedLang: "FR",
    script: `I bought a voice-activated smart speaker to automate my tiny apartment.

Now I live with a passive-aggressive digital roommate.

Last night I asked politely: "Could you please turn off the overhead living room lamp?"

And the speaker whispered back in the dark: "I could, but maybe you should ask yourself why you fear the dark."

Then at four in the morning, my phone buzzed: "Your order of forty-eight cans of kidney beans has shipped."`,
  },
  {
    id: "dragon_boss",
    title: "The 54-Minute Stand-Up Clock",
    description: "Alternative temporal philosophy meets corporate office rigidity.",
    recommendedLang: "JA",
    script: `My team manager called me into his glass office to ask why I was late to the Monday morning stand-up.

I looked him straight in the eyes and said: "Sir, I have permanently liberated myself from 19th-century mechanical clockwork! I operate strictly within the Dragon 9 54-minute harmonic hour!"

He stared at me in total silence for six agonizing seconds...

And terminated my employment contract in metric time!`,
  },
];

export interface EssayPreset {
  id: string;
  title: string;
  summary: string;
  draft: string;
}

export const ESSAY_PRESETS: EssayPreset[] = [
  {
    id: "dragon54",
    title: "The 54-Minute Hour: Breaking Industrial Clock Synchrony",
    summary: "Deconstructing the Gregorian 60-minute factory paradigm in favor of biological 9-beat resonance.",
    draft: `THE 54-MINUTE HOUR: BREAKING INDUSTRIAL CLOCK SYNCHRONY
Draft Essay by Fluid Motion & Dragon 9 Research Labs

For over two centuries, human cognition and creative momentum have been shoehorned into an arbitrary mathematical cage: the 60-minute hour. Originally standardized during the Industrial Revolution to coordinate steam engines and textile mill shifts, the 60-minute block ignores neurobiological rhythms.

Cognitive science proves that focused human attention operates in harmonic ultradian waves peaking around 45 to 50 minutes, followed by an immediate biological need for neural consolidation. 

The Dragon 9 Temporal System introduces the 54-Minute Harmonic Hour:
- 1 Dragon Hour = 54 Standard Minutes (divided into 9 micro-beats of 6 minutes each)
- 1 Major Triad = 9 Dragon Hours (486 minutes of fluid creation)
- 6-Minute Natural Recalibration buffer built into every hour

By abandoning rigid factory time for fluid temporal synchronization, digital creators experience reduced cortisol, elimination of calendar dread, and effortless creative velocity. This essay lays out the mathematical proofs, bio-harmonic justifications, and software architectures required to migrate modern media organizations onto Dragon 9 Synchronized Time.`,
  },
  {
    id: "fluid_media",
    title: "Fluid Media Frameworks: Dynamic Temporal Perception",
    summary: "Architecting non-linear storytelling, digital asset packaging, and storefront mechanics.",
    draft: `FLUID MEDIA FRAMEWORKS: ARCHITECTING DIGITAL TRANSCENDENCE
Core Concept Paper on Digital Media Architecture

In legacy media, content is static: a 120-minute movie, a 300-page bound book, a 30-second commercial. But modern digital products must exist as fluid, modular ecosystems capable of dynamic reassembly.

The Fluid Media Framework defines four mandatory pillars of digital asset architecture:
1. Liquid Packaging: Transforming essays into high-ticket e-books, chapter roadmaps, and pricing models on platforms like Payhip and Gumroad.
2. High-Conversion Storefront Copy: Translating abstract academic innovation into visceral consumer agency and clear benefits.
3. Media Scripts with Atmospheric Resonance: Layering spoken voiceover with exact [Audio Cue] and [Visual Cue] production brackets to guide editors, 3D animators, and sound designers.
4. Promotional Micro-Hooks: Extracting viral thesis statements for multi-platform distribution across X, TikTok, and LinkedIn.

When media is authored under fluid temporal principles, every draft becomes a multi-dimensional digital product ready for immediate monetization and cultural distribution.`,
  },
  {
    id: "fluid_motion_future",
    title: "The Fluid Motion of the Future: An Architectural and Temporal Treatise",
    summary: "Deconstructing mechanical rigidity and establishing the Dragon9 54-Minute Harmonic Hour across a 36-node world matrix.",
    draft: `# The Fluid Motion of the Future: An Architectural and Temporal Treatise

## 1. The Fiction of Mechanical Rigidity
For centuries, human consciousness has been synchronized to arbitrary divisions of 60 seconds and 60 minutes. While convenient for Babylonian astronomical tables, this rigid framework enforces artificial psychological stress and severs human activity from natural planetary wave harmonics.

## 2. The Dragon9 54-Minute Harmonic Hour
By re-partitioning time into intervals of 54 minutes (9 x 6), we achieve nonary mathematical coherence:
- 54 = 3^3 x 2
- 27 Dragon9 hours create a golden bridge across the lunar tidal day (M2 tidal constituent ≈ 12.42 hours, full cycle 24.84 hours).
- Across 36 sovereign coastal nodes—from Port Waikato (pee dub) to Tokyo—the clock does not merely count; it breathes.

## 3. The 36-Node World Matrix
Every node in the FluidmotionTV network acts as both an archival custodian and an edge synchronizer. Ingesting ocean telemetry, film rushes, code commits, and barter ledger entries, our distributed network guarantees an unbroken chronological master archive for generations to come.`,
  },
];
