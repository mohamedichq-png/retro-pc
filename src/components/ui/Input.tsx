// RETRO Qatar — Input Component

'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = 'left', className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-retro-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-retro-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-xl bg-retro-bg-input border text-sm text-retro-text
              placeholder-retro-text-dim
              focus:outline-none focus:ring-1 transition-all duration-200
              ${icon && iconPosition === 'left' ? 'pl-10 pr-4' : icon && iconPosition === 'right' ? 'pl-4 pr-10' : 'px-4'}
              py-2.5
              ${error
                ? 'border-retro-red/40 focus:border-retro-red focus:ring-retro-red/30'
                : 'border-retro-border focus:border-retro-cyan/50 focus:ring-retro-cyan/20'
              }
              ${className}
            `.trim()}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-retro-text-muted">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-retro-red font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
