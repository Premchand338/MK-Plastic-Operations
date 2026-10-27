import React from 'react';

interface BeadStringProgressProps {
  value: number; // percentage 0-100
  totalBeads?: number;
  className?: string;
  unitColor?: string;
}

export const BeadStringProgress: React.FC<BeadStringProgressProps> = ({
  value,
  totalBeads = 12,
  className = '',
  unitColor = '#C9A86A'
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const activeCount = Math.round((clamped / 100) * totalBeads);

  return (
    <div className={`flex items-center gap-1.5 ${className}`} title={`${value.toFixed(1)}% Yield`}>
      {/* Subtle guide string behind */}
      <div className="relative flex items-center gap-1.5">
        <div className="absolute left-1 right-1 h-[1.5px] bg-slate-300 dark:bg-slate-700 -z-0" />
        {Array.from({ length: totalBeads }).map((_, idx) => {
          const isActive = idx < activeCount;
          return (
            <div
              key={idx}
              className={`relative z-10 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'shadow-xs scale-105'
                  : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
              }`}
              style={isActive ? { backgroundColor: unitColor } : undefined}
            >
              {isActive && (
                <div className="absolute top-[1.5px] left-[1.5px] w-0.5 h-0.5 rounded-full bg-white opacity-80" />
              )}
            </div>
          );
        })}
      </div>
      <span className="text-xs font-semibold tabular-nums ml-1 text-slate-700 dark:text-slate-300">
        {value.toFixed(1)}%
      </span>
    </div>
  );
};
