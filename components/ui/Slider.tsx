'use client';

import { cn } from '@/lib/utils';

interface SliderLabel {
  value: number;
  label: string;
}

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  labels?: SliderLabel[];
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 5,
  labels = [],
  className,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Track */}
      <div className="relative pt-2">
        <div className="relative h-2 bg-white/10 rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          style={{ top: '8px' }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        {/* Thumb */}
        <div
          className="absolute top-0 w-5 h-5 bg-gold rounded-full border-2 border-black shadow-lg -translate-x-1/2 -translate-y-1 pointer-events-none transition-all"
          style={{ left: `${pct}%` }}
        />
      </div>

      {/* Step dots + labels */}
      <div className="flex justify-between items-start px-0">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((step) => {
          const labelEntry = labels.find((l) => l.value === step);
          return (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  value === step ? 'bg-gold scale-125' : 'bg-white/20 group-hover:bg-white/40'
                )}
              />
              {labelEntry ? (
                <span className="text-xs text-white/50 text-center w-16">{labelEntry.label}</span>
              ) : (
                <span className="text-xs text-white/30">{step}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current value badge */}
      <div className="text-center">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gold/15 border border-gold/40 text-gold font-bold text-lg">
          {value}
        </span>
      </div>
    </div>
  );
}
