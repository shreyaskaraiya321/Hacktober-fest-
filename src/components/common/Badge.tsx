import React from 'react';

export type BadgeVariant = 'green' | 'amber' | 'cyan' | 'rose' | 'purple' | 'zinc';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  ping?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
  green: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    dot: 'bg-cyan-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
  },
  zinc: {
    bg: 'bg-zinc-800/60',
    text: 'text-zinc-300',
    border: 'border-zinc-700/60',
    dot: 'bg-zinc-400',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'zinc',
  children,
  icon,
  ping = false,
  className = '',
  size = 'md',
}) => {
  const styles = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md border tracking-tight backdrop-blur-xs transition-colors ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses} ${className}`}
    >
      {ping && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.dot}`}
          />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${styles.dot}`} />
        </span>
      )}
      {icon && <span className="opacity-80">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
