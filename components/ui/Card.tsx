import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'gold' | 'flat';
}

export function Card({ children, variant = 'default', className, ...props }: CardProps) {
  const variants = {
    default: 'bg-surface border border-white/8 rounded-xl',
    gold: 'bg-surface border border-gold/40 rounded-xl shadow-gold',
    flat: 'bg-surface-2 rounded-xl',
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
