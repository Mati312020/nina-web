import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-background font-nunito text-text">
            <Navbar />
            <main className="flex-grow flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
};
