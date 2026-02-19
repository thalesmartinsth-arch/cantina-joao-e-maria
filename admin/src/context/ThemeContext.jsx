import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Check localStorage or default to 'default'
    // Force Light Mode for Admin
    const theme = 'light';

    useEffect(() => {
        // Force Light Mode using the existing CSS class structure
        document.body.className = 'high-contrast';
        localStorage.setItem('theme', 'high-contrast');
    }, []);

    const toggleTheme = () => {
        // No-op: Theme is forced to light
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
