import { useState } from 'react';
import { WheelItem, WheelSettings } from '@/lib/wheelUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, ChevronUp, ChevronDown, Copy, Shuffle } from 'lucide-react';
import { toast } from 'sonner';

interface WheelEditorProps {
  items: WheelItem[];
  settings: WheelSettings;
  enabledCount: number;
  totalWeight: number;
  isSpinning: boolean;
  onAddItem: (text?: string) => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<WheelItem>) => void;
  onMoveItem: (id: string, direction: 'up' | 'down') => void;
  onBatchAdd: (text: string) => void;
  onLoadSample: () => void;
  onUpdateSettings: (updates: Partial<WheelSettings>) => void;
  onGetShareUrl: () => string;
}

export function WheelEditor({
  items, settings, enabledCount, totalWeight, isSpinning,
  onAddItem, onRemoveItem, onUpdateItem, onMoveItem,
  onBatchAdd, onLoadSample, onUpdateSettings, onGetShareUrl,
}: WheelEditorProps) {
  const [showBatch, setShowBatch] = useState(false);
  const [batchText, setBatchText] = useState('');

  const handleBatchSubmit = () => {
    if (batchText.trim()) {
      onBatchAdd(batchText);
      setBatchText('');
      setShowBatch(false);
    }
  };

  const handleShare = () => {
    const url = onGetShareUrl();
    navigator.clipboard.writeText(url).then(
      () => toast.success('已複製分享連結！'),
      () => toast.error('複製失敗')
    );
  };

  return (
    <div className="bg-card rounded-xl border p-4 space-y-4">
      {/* Stats */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary">有效選項：{enabledCount}</Badge>
        {settings.mode === 'weighted' && (
          <Badge variant="outline">總權重：{totalWeight}</Badge>
        )}
      </div>

      {/* Item list */}
      <ScrollArea className="max-h-[320px]">
        <div className="space-y-2 pr-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-center gap-1.5 p-2 rounded-lg border transition-opacity ${
                !item.enabled ? 'opacity-40' : ''
              }`}
            >
              <input
                type="color"
                value={item.color}
                onChange={(e) => onUpdateItem(item.id, { color: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border-0 p-0 shrink-0"
                disabled={isSpinning}
                aria-label="選擇顏色"
              />
              <Input
                value={item.text}
                onChange={(e) => onUpdateItem(item.id, { text: e.target.value })}
                className="flex-1 h-8 text-sm min-w-0"
                placeholder="選項名稱"
                disabled={isSpinning}
              />
              {settings.mode === 'weighted' && (
                <Input
                  type="number"
                  min={1}
                  value={item.weight}
                  onChange={(e) => onUpdateItem(item.id, { weight: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-16 h-8 text-sm text-center shrink-0"
                  disabled={isSpinning}
                  aria-label="權重"
                />
              )}
              <Switch
                checked={item.enabled}
                onCheckedChange={(checked) => onUpdateItem(item.id, { enabled: checked })}
                disabled={isSpinning}
                aria-label="啟用/停用"
                className="shrink-0"
              />
              <button
                onClick={() => onMoveItem(item.id, 'up')}
                disabled={idx === 0 || isSpinning}
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 shrink-0"
                aria-label="上移"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => onMoveItem(item.id, 'down')}
                disabled={idx === items.length - 1 || isSpinning}
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 shrink-0"
                aria-label="下移"
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
                disabled={isSpinning}
                className="p-1 text-destructive/60 hover:text-destructive disabled:opacity-30 shrink-0"
                aria-label="刪除"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => onAddItem()} disabled={isSpinning}>
          <Plus size={14} className="mr-1" /> 新增
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowBatch(!showBatch)} disabled={isSpinning}>
          批次新增
        </Button>
        <Button size="sm" variant="outline" onClick={onLoadSample} disabled={isSpinning}>
          <Shuffle size={14} className="mr-1" /> 範例資料
        </Button>
      </div>

      {showBatch && (
        <div className="space-y-2">
          <textarea
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            placeholder="每行一個選項，或用逗號分隔"
            className="w-full h-24 p-2 text-sm border rounded-lg bg-background resize-none focus:ring-2 focus:ring-ring focus:outline-none"
          />
          <Button size="sm" onClick={handleBatchSubmit}>確認新增</Button>
        </div>
      )}

      <Separator />

      {/* Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm">抽選模式</Label>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={settings.mode === 'equal' ? 'default' : 'outline'}
              onClick={() => onUpdateSettings({ mode: 'equal' })}
              disabled={isSpinning}
              className="h-7 text-xs"
            >
              等機率
            </Button>
            <Button
              size="sm"
              variant={settings.mode === 'weighted' ? 'default' : 'outline'}
              onClick={() => onUpdateSettings({ mode: 'weighted' })}
              disabled={isSpinning}
              className="h-7 text-xs"
            >
              依權重
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="no-repeat" className="text-sm">不重複抽取</Label>
          <Switch
            id="no-repeat"
            checked={settings.noRepeat}
            onCheckedChange={(checked) => onUpdateSettings({ noRepeat: checked })}
            disabled={isSpinning}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="sound" className="text-sm">音效</Label>
          <Switch
            id="sound"
            checked={settings.soundEnabled}
            onCheckedChange={(checked) => onUpdateSettings({ soundEnabled: checked })}
          />
        </div>
      </div>

      <Separator />

      <Button size="sm" variant="outline" onClick={handleShare} className="w-full">
        <Copy size={14} className="mr-1" /> 複製分享連結
      </Button>
    </div>
  );
}
