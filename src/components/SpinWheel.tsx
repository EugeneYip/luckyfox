import { WheelItem, WheelSettings, getSegments, getArcPath, polarToCartesian, getContrastColor } from '@/lib/wheelUtils';
import { useI18n } from '@/lib/i18n';

interface SpinWheelProps {
  items: WheelItem[];
  settings: WheelSettings;
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
}

const CX = 200;
const CY = 210;
const R = 170;

export function SpinWheel({ items, settings, rotation, isSpinning, onSpin }: SpinWheelProps) {
  const { t } = useI18n();
  const segments = getSegments(items, settings.mode);
  const enabledCount = items.filter(i => i.enabled).length;
  const fontSize = Math.min(14, Math.max(9, 130 / Math.max(enabledCount, 1)));
  const canSpin = enabledCount >= 2 && !isSpinning;

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none" role="img" aria-label={t('wheelLabel')}>
      <svg viewBox="0 0 400 430" className="w-full wheel-shadow">
        <polygon points="200,42 187,12 213,12" className="fill-primary" stroke="white" strokeWidth="2.5" />
        <g transform={`rotate(${rotation} ${CX} ${CY})`}>
          <circle cx={CX} cy={CY} r={R + 6} fill="none" className="stroke-foreground/10" strokeWidth="4" />
          {segments.length === 0 && <circle cx={CX} cy={CY} r={R} className="fill-muted" />}
          {segments.map((seg) => {
            const midAngle = (seg.startAngle + seg.endAngle) / 2;
            const segAngle = seg.endAngle - seg.startAngle;
            const shouldFlip = midAngle > 90 && midAngle < 270;
            const textRotation = shouldFlip ? midAngle + 180 : midAngle;
            const textR = R * 0.62;
            const tp = polarToCartesian(CX, CY, textR, midAngle);
            const textColor = getContrastColor(seg.item.color);
            const maxChars = Math.max(2, Math.floor(segAngle / 10));
            const label = seg.item.text.length > maxChars ? seg.item.text.slice(0, maxChars - 1) + '…' : seg.item.text;
            return (
              <g key={seg.item.id}>
                <path d={getArcPath(CX, CY, R, seg.startAngle, seg.endAngle)} fill={seg.item.color} stroke="white" strokeWidth="1.5" />
                {segAngle > 10 && (
                  <text x={tp.x} y={tp.y} fill={textColor} fontSize={fontSize} fontWeight="600" textAnchor="middle" dominantBaseline="central" transform={`rotate(${textRotation} ${tp.x} ${tp.y})`} className="pointer-events-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
        <g onClick={() => canSpin && onSpin()} className={canSpin ? 'cursor-pointer' : 'cursor-not-allowed'} role="button" aria-label={isSpinning ? t('spinningLabel') : t('spinLabel')} tabIndex={0} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && canSpin) { e.preventDefault(); onSpin(); } }}>
          <circle cx={CX} cy={CY} r={36} className="fill-primary" stroke="white" strokeWidth="3" />
          <circle cx={CX} cy={CY} r={30} fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
          <text x={CX} y={CY} fill="white" fontSize="14" fontWeight="700" textAnchor="middle" dominantBaseline="central" className="pointer-events-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {isSpinning ? t('spinning') : t('spin')}
          </text>
        </g>
      </svg>
    </div>
  );
}
