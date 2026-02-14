import { useWheel } from '@/hooks/useWheel';
import { SpinWheel } from '@/components/SpinWheel';
import { WheelEditor } from '@/components/WheelEditor';
import { ResultDialog } from '@/components/ResultDialog';
import { HistoryPanel } from '@/components/HistoryPanel';
import { LangToggle } from '@/components/LangToggle';
import { useI18n } from '@/lib/i18n';

const Index = () => {
  const wheel = useWheel();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <header className="text-center pt-8 pb-4 px-4 relative">
        <div className="absolute right-4 top-4">
          <LangToggle />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">{t('subtitle')}</p>
      </header>

      <main className="container mx-auto px-4 pb-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3 flex flex-col items-center gap-3">
            <SpinWheel
              items={wheel.items}
              settings={wheel.settings}
              rotation={wheel.rotation}
              isSpinning={wheel.isSpinning}
              onSpin={wheel.spin}
            />
            {wheel.enabledCount < 2 && (
              <p className="text-sm text-destructive font-medium">{t('minItems')}</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <WheelEditor
              items={wheel.items}
              settings={wheel.settings}
              enabledCount={wheel.enabledCount}
              totalWeight={wheel.totalWeight}
              isSpinning={wheel.isSpinning}
              onAddItem={wheel.addItem}
              onRemoveItem={wheel.removeItem}
              onUpdateItem={wheel.updateItem}
              onMoveItem={wheel.moveItem}
              onBatchAdd={wheel.batchAdd}
              onLoadSample={wheel.loadSample}
              onUpdateSettings={wheel.updateSettings}
              onGetShareUrl={wheel.getShareUrl}
            />
          </div>
        </div>

        <div className="mt-6">
          <HistoryPanel history={wheel.history} onClear={wheel.clearHistory} />
        </div>
      </main>

      <ResultDialog result={wheel.result} onClose={wheel.clearResult} />
    </div>
  );
};

export default Index;
