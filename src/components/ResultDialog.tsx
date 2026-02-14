import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WheelItem, getContrastColor } from '@/lib/wheelUtils';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';

interface ResultDialogProps {
  result: WheelItem | null;
  onClose: () => void;
}

export function ResultDialog({ result, onClose }: ResultDialogProps) {
  const { t } = useI18n();

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.text).then(
        () => toast.success(t('resultCopied')),
        () => toast.error(t('resultFailed'))
      );
    }
  };

  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-lg">{t('resultTitle')}</DialogTitle>
        </DialogHeader>
        {result && (
          <div className="py-6 space-y-4">
            <div className="inline-block px-8 py-4 rounded-2xl text-3xl font-bold shadow-lg" style={{ backgroundColor: result.color, color: getContrastColor(result.color) }}>
              {result.text}
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy size={14} className="mr-1" /> {t('copyResult')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
