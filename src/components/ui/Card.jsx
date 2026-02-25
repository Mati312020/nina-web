import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={twMerge(
                "bg-white rounded-card shadow-sm border border-gray-100 p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
