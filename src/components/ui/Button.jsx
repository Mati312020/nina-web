import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
    children,
    variant = 'primary',
    className,
    isLoading,
    ...props
}) => {
    const baseStyles = "px-6 py-3 rounded-button font-bold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-primary text-white hover:bg-teal-600 shadow-lg shadow-teal-500/30",
        secondary: "bg-secondary text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30",
        outline: "border-2 border-primary text-primary hover:bg-primary/5",
        ghost: "text-gray-600 hover:text-primary hover:bg-gray-100",
        white: "bg-white text-primary hover:bg-gray-50 shadow-md"
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : children}
        </button>
    );
};
