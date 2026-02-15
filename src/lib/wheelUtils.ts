import { SAMPLE_ITEMS, type Lang } from './i18n';

export interface WheelItem {
  id: string;
  text: string;
  weight: number;
  color: string;
  enabled: boolean;
}

export interface WheelSettings {
  mode: 'equal' | 'weighted';
  noRepeat: boolean;
  soundEnabled: boolean;
}

export interface HistoryEntry {
  time: string;
  result: string;
  mode: string;
}

export const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#F7DC6F', '#85C1E9',
  '#F8C471', '#82E0AA', '#BB8FCE', '#E8A87C',
];

export const DEFAULT_SETTINGS: WheelSettings = {
  mode: 'equal',
  noRepeat: false,
  soundEnabled: true,
};

export function createSampleItems(lang: Lang = 'en'): WheelItem[] {
  const items = SAMPLE_ITEMS[lang] || SAMPLE_ITEMS.en;
  return items.map((text, i) => ({
    id: crypto.randomUUID(),
    text,
    weight: 1,
    color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    enabled: true,
  }));
}

export function createItem(text = '', colorIndex = 0): WheelItem {
  return {
    id: crypto.randomUUID(),
    text,
    weight: 1,
    color: DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length],
    enabled: true,
  };
}

export function selectWeightedRandom(items: WheelItem[], mode: 'equal' | 'weighted'): WheelItem {
  const enabled = items.filter(i => i.enabled);
  if (enabled.length === 0) throw new Error('No enabled items');

  if (mode === 'equal') {
    return enabled[Math.floor(Math.random() * enabled.length)];
  }

  const totalWeight = enabled.reduce((sum, i) => sum + i.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of enabled) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  return enabled[enabled.length - 1];
}

export interface Segment {
  item: WheelItem;
  startAngle: number;
  endAngle: number;
}

export function getSegments(items: WheelItem[], mode: 'equal' | 'weighted'): Segment[] {
  const enabled = items.filter(i => i.enabled);
  if (enabled.length === 0) return [];

  const total = mode === 'equal'
    ? enabled.length
    : enabled.reduce((sum, i) => sum + i.weight, 0);

  let currentAngle = 0;
  return enabled.map(item => {
    const proportion = mode === 'equal' ? 1 / enabled.length : item.weight / total;
    const angle = proportion * 360;
    const segment: Segment = { item, startAngle: currentAngle, endAngle: currentAngle + angle };
    currentAngle += angle;
    return segment;
  });
}

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function getArcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  if (endAngle - startAngle >= 359.99) {
    const top = polarToCartesian(cx, cy, r, 0);
    const bottom = polarToCartesian(cx, cy, r, 180);
    return `M ${cx} ${cy} L ${top.x} ${top.y} A ${r} ${r} 0 1 1 ${bottom.x} ${bottom.y} A ${r} ${r} 0 1 1 ${top.x} ${top.y} Z`;
  }
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}


export function getContrastColor(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1a1a2e' : '#ffffff';
}

// --- Audio ---
let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

export function playTick() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 600 + Math.random() * 400;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  } catch { /* ignore */ }
}

export function playWinSound() {
  try {
    const ctx = getAudioCtx();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch { /* ignore */ }
}

export function tryVibrate(ms = 50) {
  try { navigator?.vibrate?.(ms); } catch { /* ignore */ }
}

// --- Serialization ---
export function serializeState(items: WheelItem[], settings: WheelSettings): string {
  return btoa(encodeURIComponent(JSON.stringify({ items, settings })));
}

export function deserializeState(hash: string): { items: WheelItem[]; settings: WheelSettings } | null {
  try {
    return JSON.parse(decodeURIComponent(atob(hash)));
  } catch {
    return null;
  }
}
