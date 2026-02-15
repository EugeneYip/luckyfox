import { useI18n, LANG_OPTIONS } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LangToggle() {
  const { lang, setLang } = useI18n();
  const current = LANG_OPTIONS.find(o => o.code === lang)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" aria-label="Change language">
          <Languages size={14} />
          <span>{current.flag} {current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[320px] overflow-y-auto z-50">
        {LANG_OPTIONS.map(opt => (
          <DropdownMenuItem
            key={opt.code}
            onClick={() => setLang(opt.code)}
            className={lang === opt.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{opt.flag}</span>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
