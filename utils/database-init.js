import React, { useState, useEffect } from 'react';
import { initializeDatabase } from './data-utils';

// Database initialization hook
export const useDatabaseInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initializeDatabase();
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  return { isInitialized, isLoading, error };
};

// Simple initialization function for use in App.js
export const initDatabase = async () => {
  try {
    await initializeDatabase();
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};
