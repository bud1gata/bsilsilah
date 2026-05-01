import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white hover:from-purple-800 hover:to-fuchsia-700': variant === 'default',
          'bg-red-500 text-white hover:bg-red-600': variant === 'destructive',
          'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900': variant === 'outline',
          'hover:bg-slate-100 hover:text-slate-900': variant === 'ghost',
          'h-10 px-4 py-2': size === 'default',
          'h-9 rounded-md px-3': size === 'sm',
          'h-11 rounded-md px-8': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
