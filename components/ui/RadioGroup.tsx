'use client';

import { cn } from '@/lib/utils';

interface RadioGroupProps {
  options: string[];
  value: string | undefined;
  onChange: (value: string) => void;
  name: string;
}

export function RadioGroup({ options, value, onChange, name }: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-3" role="radiogroup">
      {options.map((option) => {
        const selected = value === option;
        return (
          <label
            key={option}
            className={cn(
              'flex items-center gap-4 px-5 py-4 rounded-xl border cursor-pointer transition-all duration-150 select-none',
              selected
                ? 'border-gold bg-gold/8 text-white'
                : 'border-white/10 bg-surface hover:border-white/25 hover:bg-surface-2 text-white/70'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {/* Custom radio dot */}
            <span
              className={cn(
                'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                selected ? 'border-gold' : 'border-white/30'
              )}
            >
              {selected && <span className="w-2.5 h-2.5 rounded-full bg-gold" />}
            </span>
            <span className="font-medium text-base leading-snug">{option}</span>
          </label>
        );
      })}
    </div>
  );
}
