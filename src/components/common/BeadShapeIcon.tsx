import React from 'react';
import { BeadShape } from '../../types';

interface BeadShapeIconProps {
  shape: BeadShape;
  className?: string;
  size?: number;
}

export const BeadShapeIcon: React.FC<BeadShapeIconProps> = ({ shape, className = 'w-4 h-4', size = 16 }) => {
  switch (shape) {
    case 'Round':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="9" cy="9" rx="3" ry="1.8" fill="#ffffff" opacity="0.6" transform="rotate(-30 9 9)" />
        </svg>
      );
    case 'Half Round':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M 12 3 A 9 9 0 0 1 12 21 Z" />
          <line x1="12" y1="3" x2="12" y2="21" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
        </svg>
      );
    case 'Drop':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M 12 2.5 C 12 2.5 5 11 5 16 A 7 7 0 0 0 19 16 C 19 11 12 2.5 12 2.5 Z" />
          <ellipse cx="10" cy="14" rx="2.5" ry="4" fill="#ffffff" opacity="0.5" />
        </svg>
      );
    case 'Munga':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          {/* Faceted diamond / cylindrical bead */}
          <polygon points="12,2 20,8 18,22 6,22 4,8" />
          <line x1="12" y1="2" x2="12" y2="22" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
        </svg>
      );
    case 'Sujni':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          {/* Elongated barrel / rice shape */}
          <path d="M 12 2 C 16 7, 18 12, 18 17 C 18 20, 15 22, 12 22 C 9 22, 6 20, 6 17 C 6 12, 8 7, 12 2 Z" />
          <ellipse cx="10" cy="12" rx="2" ry="5" fill="#ffffff" opacity="0.5" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};
