import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
  color?: 'gold' | 'white';
}

export function Progress({ value, className, showLabel = false, color = 'gold' }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            color === 'gold' ? 'bg-gold' : 'bg-white'
          )}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-white/40 mt-1 text-right">{pct}%</p>
      )}
    </div>
  );
}

interface CategoryBarProps {
  label: string;
  value: number;
  maxValue: number;
  className?: string;
}

export function CategoryBar({ label, value, maxValue, className }: CategoryBarProps) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const color =
    pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-gold' : 'bg-red-500/80';

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-white/70">{label}</span>
        <span className="text-sm font-semibold text-white">
          {value}
          <span className="text-white/30 font-normal">/{maxValue}</span>
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
