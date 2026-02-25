import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={twMerge(
                    "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500",
                    error && "border-danger focus:border-danger focus:ring-danger/20",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-danger ml-1">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
