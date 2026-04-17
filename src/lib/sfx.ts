// Lightweight Web Audio sfx layer for the Messenger / MSL sandbox.
//
// Why Web Audio instead of <audio>: polyphony (no element-pool limits),
// sub-millisecond playback latency, and cheap runtime pitch via `detune`.
// One decoded AudioBuffer per sound serves unlimited simultaneous plays.
//
// Usage:
//   sfx.pop({ pitch: 0.3, intensity: 0.8 });
//   sfx.tick({ intensity: 0.5 });
//   sfx.thud({ intensity: 0.9 });
//   sfx.setMuted(true); // persists to localStorage

type SoundName = "pop" | "tick" | "thud";

type SoundConfig = {
  src: string;
  // Base gain applied before the per-play intensity multiplier.
  gain: number;
  // Pitch range in cents (detune) mapped from pitch: 0 → -range, 1 → +range.
  pitchRange: number;
};

const SOUND_CONFIG: Record<SoundName, SoundConfig> = {
  pop: { src: "/pop.mp3", gain: 0.32, pitchRange: 400 }, // ±4 semitones
  tick: { src: "/tick.mp3", gain: 0.22, pitchRange: 300 },
  thud: { src: "/thud.mp3", gain: 0.28, pitchRange: 200 },
};

const STORAGE_KEY = "flo.sfx.muted";

// Auto-detect leading silence. AI-generated SFX often have 100–300ms of
// near-zero samples at the top of the file, which would delay playback
// perceptibly. We scan the first channel and return the offset (in seconds)
// at which actual sound begins, with a 32-sample lead-in so the attack
// transient isn't clipped.
function detectAudioStart(buffer: AudioBuffer, threshold = 0.005): number {
  const data = buffer.getChannelData(0);
  const maxScan = Math.min(data.length, buffer.sampleRate * 2); // first 2s
  for (let i = 0; i < maxScan; i++) {
    if (Math.abs(data[i]) > threshold) {
      return Math.max(0, (i - 32) / buffer.sampleRate);
    }
  }
  return 0;
}

class SfxEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers: Partial<Record<SoundName, AudioBuffer>> = {};
  private startOffsets: Partial<Record<SoundName, number>> = {};
  private loadPromises: Partial<Record<SoundName, Promise<AudioBuffer | null>>> = {};
  private muted = false;
  private loaded = false;
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.muted = window.localStorage.getItem(STORAGE_KEY) === "1";
      } catch {
        /* ignore */
      }
    }
  }

  // Called once the user has interacted (AudioContext autoplay policy).
  // Safe to call repeatedly.
  private ensureContext() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
      return;
    }
    if (typeof window === "undefined") return;
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 1;
    this.master.connect(this.ctx.destination);
  }

  // Kick off decoding for all sounds. Idempotent. Must run in a browser.
  preload() {
    if (this.loaded) return;
    this.loaded = true;
    this.ensureContext();
    if (!this.ctx) return;
    for (const name of Object.keys(SOUND_CONFIG) as SoundName[]) {
      this.loadOne(name);
    }
  }

  private loadOne(name: SoundName): Promise<AudioBuffer | null> {
    if (this.buffers[name]) return Promise.resolve(this.buffers[name]!);
    if (this.loadPromises[name]) return this.loadPromises[name]!;
    const promise = (async () => {
      try {
        if (!this.ctx) return null;
        const res = await fetch(SOUND_CONFIG[name].src);
        if (!res.ok) return null;
        const arr = await res.arrayBuffer();
        const buf = await this.ctx.decodeAudioData(arr);
        this.buffers[name] = buf;
        this.startOffsets[name] = detectAudioStart(buf);
        return buf;
      } catch {
        return null;
      }
    })();
    this.loadPromises[name] = promise;
    return promise;
  }

  play(name: SoundName, opts: { pitch?: number; intensity?: number } = {}) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx || !this.master) return;
    const buf = this.buffers[name];
    if (!buf) {
      // Not decoded yet — kick off load, drop this play. (First click after
      // page load may miss; subsequent clicks fire.)
      this.loadOne(name);
      return;
    }
    const cfg = SOUND_CONFIG[name];
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    // Pitch in [-1, 1] — map to detune in cents centered on 0.
    const pitch = Math.max(0, Math.min(1, opts.pitch ?? 0.5));
    src.detune.value = (pitch - 0.5) * 2 * cfg.pitchRange;

    const gain = this.ctx.createGain();
    const intensity = Math.max(0, Math.min(1, opts.intensity ?? 1));
    gain.gain.value = cfg.gain * intensity;
    src.connect(gain);
    gain.connect(this.master);
    // Skip past any leading silence auto-detected at decode time so the
    // attack transient fires the instant we call play().
    const offset = this.startOffsets[name] ?? 0;
    src.start(0, offset);
    // Auto-cleanup
    src.onended = () => {
      try { src.disconnect(); gain.disconnect(); } catch { /* */ }
    };
  }

  pop(opts: { pitch?: number; intensity?: number } = {}) { this.play("pop", opts); }
  tick(opts: { pitch?: number; intensity?: number } = {}) { this.play("tick", opts); }
  thud(opts: { pitch?: number; intensity?: number } = {}) { this.play("thud", opts); }

  setMuted(next: boolean) {
    this.muted = next;
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch { /* */ }
    }
    if (this.master && this.ctx) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(next ? 0 : 1, t + 0.06);
    }
    for (const l of this.listeners) l();
  }

  isMuted() { return this.muted; }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }
}

export const sfx = new SfxEngine();
