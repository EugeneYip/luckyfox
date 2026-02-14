import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LangToggle() {
  const { lang, toggleLang } = useI18n();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLang}
      className="h-8 gap-1.5 text-xs"
      aria-label={lang === 'zh' ? 'Switch to English' : '切換為中文'}
    >
      <Languages size={14} />
      {lang === 'zh' ? 'EN' : '中文'}
    </Button>
  );
}
