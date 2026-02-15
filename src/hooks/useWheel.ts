import { useState, useCallback, useRef, useEffect } from 'react';
import {
  WheelItem, WheelSettings, HistoryEntry,
  createSampleItems, createItem, DEFAULT_SETTINGS,
  selectWeightedRandom, getSegments,
  playTick, playWinSound, tryVibrate,
  serializeState, deserializeState,
} from '@/lib/wheelUtils';
import { useI18n } from '@/lib/i18n';

const STORAGE_KEY = 'lucky-wheel-data';
const HISTORY_KEY = 'lucky-wheel-history';

function loadInitialData(): { items: WheelItem[]; settings: WheelSettings } {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const data = deserializeState(hash);
    if (data?.items?.length) return data;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data?.items?.length) return data;
    }
  } catch { /* ignore */ }
  const lang = (localStorage.getItem('wheel-lang') || 'en') as any;
  return { items: createSampleItems(lang), settings: DEFAULT_SETTINGS };
}

export function useWheel() {
  const { lang, t } = useI18n();
  const [items, setItems] = useState<WheelItem[]>(() => loadInitialData().items);
  const [settings, setSettings] = useState<WheelSettings>(() => loadInitialData().settings);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<WheelItem | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  });

  const animRef = useRef<number>();
  const lastSegRef = useRef(-1);

  useEffect(() => {
    if (window.location.hash.length > 1) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, settings }));
  }, [items, settings]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const enabledCount = items.filter(i => i.enabled).length;
  const totalWeight = items.filter(i => i.enabled).reduce((sum, i) => sum + i.weight, 0);

  const addItem = useCallback((text = '') => {
    setItems(prev => [...prev, createItem(text, prev.length)]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<WheelItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }, []);

  const batchAdd = useCallback((text: string) => {
    const lines = text.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    setItems(prev => {
      const newItems = lines.map((t, i) => createItem(t, prev.length + i));
      return [...prev, ...newItems];
    });
  }, []);

  const loadSample = useCallback(() => {
    setItems(createSampleItems(lang));
    setSettings(DEFAULT_SETTINGS);
  }, [lang]);

  const updateSettings = useCallback((updates: Partial<WheelSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || enabledCount < 2) return;
    setIsSpinning(true);
    setResult(null);

    const winner = selectWeightedRandom(items, settings.mode);
    const segments = getSegments(items, settings.mode);
    const winnerSeg = segments.find(s => s.item.id === winner.id)!;

    const segAngle = winnerSeg.endAngle - winnerSeg.startAngle;
    const targetAngle = winnerSeg.startAngle + segAngle * (0.2 + Math.random() * 0.6);

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const targetMod = ((360 - targetAngle) % 360 + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta <= 0) delta += 360;
    const finalRotation = rotation + extraSpins * 360 + delta;

    const startRotation = rotation;
    const duration = 4000 + Math.random() * 2000;
    const startTime = performance.now();
    lastSegRef.current = -1;

    const modeLabel = settings.mode === 'equal' ? t('modeEqual') : t('modeWeighted');

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startRotation + (finalRotation - startRotation) * eased;
      setRotation(current);

      if (settings.soundEnabled && segments.length > 1) {
        const pointerAngle = ((360 - (current % 360)) % 360 + 360) % 360;
        let segIdx = segments.findIndex(s => pointerAngle >= s.startAngle && pointerAngle < s.endAngle);
        if (segIdx < 0) segIdx = segments.length - 1;
        if (segIdx !== lastSegRef.current && lastSegRef.current !== -1) playTick();
        lastSegRef.current = segIdx;
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setResult(winner);
        if (settings.soundEnabled) playWinSound();
        tryVibrate(100);

        setHistory(prev => [{
          time: new Date().toLocaleString(),
          result: winner.text,
          mode: modeLabel,
        }, ...prev].slice(0, 50));

        if (settings.noRepeat) {
          setItems(prev => prev.map(i => i.id === winner.id ? { ...i, enabled: false } : i));
        }
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [isSpinning, enabledCount, items, settings, rotation, t]);

  const clearResult = useCallback(() => setResult(null), []);
  const clearHistory = useCallback(() => setHistory([]), []);

  const getShareUrl = useCallback(() => {
    const hash = serializeState(items, settings);
    return `${window.location.origin}${window.location.pathname}#${hash}`;
  }, [items, settings]);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return {
    items, settings, rotation, isSpinning, result, history,
    enabledCount, totalWeight,
    addItem, removeItem, updateItem, moveItem,
    batchAdd, loadSample, updateSettings,
    spin, clearResult, clearHistory, getShareUrl,
  };
}
