'use client';

import { cn } from '@/lib/utils';

interface YesNoProps {
  value: boolean | undefined;
  onChange: (value: boolean) => void;
}

export function YesNo({ value, onChange }: YesNoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: 'Ja', val: true, icon: '✓' },
        { label: 'Nein', val: false, icon: '✗' },
      ].map(({ label, val, icon }) => {
        const selected = value === val;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(val)}
            className={cn(
              'flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-xl border text-center cursor-pointer transition-all duration-150 select-none',
              selected
                ? val
                  ? 'border-emerald-500 bg-emerald-500/10 text-white'
                  : 'border-red-500/70 bg-red-500/10 text-white'
                : 'border-white/10 bg-surface hover:border-white/25 hover:bg-surface-2 text-white/60'
            )}
          >
            <span
              className={cn(
                'text-2xl font-bold',
                selected ? (val ? 'text-emerald-400' : 'text-red-400') : 'text-white/30'
              )}
            >
              {icon}
            </span>
            <span className="font-semibold text-lg">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
