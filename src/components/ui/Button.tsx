// RETRO Qatar — Button Component

'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-gradient-to-r from-retro-cyan-muted to-retro-cyan text-retro-bg font-bold hover:shadow-[0_4px_20px_rgba(34,211,238,0.3)] hover:-translate-y-0.5',
  secondary: 'bg-retro-cyan/10 border border-retro-cyan/20 text-retro-cyan font-semibold hover:bg-retro-cyan/15 hover:border-retro-cyan/40',
  accent: 'bg-gradient-to-r from-retro-purple-muted to-retro-purple text-white font-bold hover:shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5',
  ghost: 'bg-transparent text-retro-text-secondary hover:text-retro-text hover:bg-white/5',
  danger: 'bg-retro-red/10 border border-retro-red/20 text-retro-red font-semibold hover:bg-retro-red/20',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-sm rounded-xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center transition-all duration-200 cursor-pointer
        focus-ring select-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
}
