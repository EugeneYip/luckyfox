import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Lang = 'zh' | 'en';

const translations = {
  zh: {
    title: '🎡 幸運轉盤',
    subtitle: '隨機選擇，讓命運決定！',
    spin: '旋轉',
    spinning: '…',
    minItems: '至少需要 2 個有效選項才能旋轉',
    activeItems: '有效選項',
    totalWeight: '總權重',
    optionPlaceholder: '選項名稱',
    colorLabel: '選擇顏色',
    weightLabel: '權重',
    enableLabel: '啟用/停用',
    moveUp: '上移',
    moveDown: '下移',
    deleteLabel: '刪除',
    add: '新增',
    batchAdd: '批次新增',
    batchPlaceholder: '每行一個選項，或用逗號分隔',
    batchConfirm: '確認新增',
    sampleData: '範例資料',
    mode: '抽選模式',
    modeEqual: '等機率',
    modeWeighted: '依權重',
    noRepeat: '不重複抽取',
    sound: '音效',
    copyShareLink: '複製分享連結',
    shareCopied: '已複製分享連結！',
    shareFailed: '複製失敗',
    resultTitle: '🎉 抽選結果',
    copyResult: '複製結果',
    resultCopied: '已複製結果！',
    resultFailed: '複製失敗',
    history: '歷史紀錄',
    clearHistory: '清除',
    wheelLabel: '幸運轉盤',
    spinLabel: '開始旋轉',
    spinningLabel: '旋轉中',
  },
  en: {
    title: '🎡 Lucky Wheel',
    subtitle: 'Random selection, let fate decide!',
    spin: 'SPIN',
    spinning: '…',
    minItems: 'At least 2 active items needed to spin',
    activeItems: 'Active items',
    totalWeight: 'Total weight',
    optionPlaceholder: 'Option name',
    colorLabel: 'Pick color',
    weightLabel: 'Weight',
    enableLabel: 'Enable/Disable',
    moveUp: 'Move up',
    moveDown: 'Move down',
    deleteLabel: 'Delete',
    add: 'Add',
    batchAdd: 'Batch add',
    batchPlaceholder: 'One per line, or comma-separated',
    batchConfirm: 'Confirm',
    sampleData: 'Sample data',
    mode: 'Draw mode',
    modeEqual: 'Equal',
    modeWeighted: 'Weighted',
    noRepeat: 'No repeat',
    sound: 'Sound',
    copyShareLink: 'Copy share link',
    shareCopied: 'Share link copied!',
    shareFailed: 'Copy failed',
    resultTitle: '🎉 Result',
    copyResult: 'Copy result',
    resultCopied: 'Result copied!',
    resultFailed: 'Copy failed',
    history: 'History',
    clearHistory: 'Clear',
    wheelLabel: 'Lucky Wheel',
    spinLabel: 'Start spinning',
    spinningLabel: 'Spinning',
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;

interface I18nContextType {
  lang: Lang;
  t: (key: TranslationKey) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('wheel-lang');
    return (saved === 'en' || saved === 'zh') ? saved : 'zh';
  });

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'zh' ? 'en' : 'zh';
      localStorage.setItem('wheel-lang', next);
      return next;
    });
  }, []);

  const t = useCallback((key: TranslationKey) => translations[lang][key], [lang]);

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
