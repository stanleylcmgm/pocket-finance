import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from './translations/en';
import { zh } from './translations/zh';
import { es } from './translations/es';

const translations = {
  en,
  zh,
  es,
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    loadLocale();
  }, []);

  const loadLocale = async () => {
    try {
      const savedLocale = await AsyncStorage.getItem('app_locale');
      if (savedLocale && translations[savedLocale]) {
        setLocale(savedLocale);
      }
    } catch (error) {
      console.error('Error loading locale:', error);
    }
  };

  const changeLocale = async (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      try {
        await AsyncStorage.setItem('app_locale', newLocale);
      } catch (error) {
        console.error('Error saving locale:', error);
      }
    }
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    if (typeof value === 'string' && Object.keys(params).length > 0) {
      // Simple parameter replacement
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ t, locale, changeLocale, availableLocales: Object.keys(translations) }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

