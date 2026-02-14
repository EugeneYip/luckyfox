import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WheelItem, getContrastColor } from '@/lib/wheelUtils';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ResultDialogProps {
  result: WheelItem | null;
  onClose: () => void;
}

export function ResultDialog({ result, onClose }: ResultDialogProps) {
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.text).then(
        () => toast.success('已複製結果！'),
        () => toast.error('複製失敗')
      );
    }
  };

  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-lg">🎉 抽選結果</DialogTitle>
        </DialogHeader>
        {result && (
          <div className="py-6 space-y-4">
            <div
              className="inline-block px-8 py-4 rounded-2xl text-3xl font-bold shadow-lg"
              style={{ backgroundColor: result.color, color: getContrastColor(result.color) }}
            >
              {result.text}
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy size={14} className="mr-1" /> 複製結果
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
