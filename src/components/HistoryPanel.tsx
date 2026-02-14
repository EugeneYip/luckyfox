import { HistoryEntry } from '@/lib/wheelUtils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  const { t } = useI18n();
  if (history.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{t('history')}</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-7 text-xs text-muted-foreground">
          <Trash2 size={12} className="mr-1" /> {t('clearHistory')}
        </Button>
      </div>
      <ScrollArea className="max-h-[200px]">
        <div className="space-y-1">
          {history.map((entry, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-1.5 px-2 rounded hover:bg-muted/50">
              <span className="font-medium">{entry.result}</span>
              <span className="text-muted-foreground text-xs">{entry.mode} · {entry.time}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
