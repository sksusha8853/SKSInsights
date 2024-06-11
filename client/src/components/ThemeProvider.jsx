import React from 'react';
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector(state => state.theme);

  return (
    <div className={`${theme} min-h-screen bg-white dark:bg-[rgb(16,23,42)] text-gray-700 dark:text-gray-200`}>
      {children}
    </div>
  );
}
