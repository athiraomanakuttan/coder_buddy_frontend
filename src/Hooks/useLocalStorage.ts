"use client"

import { useState, useEffect } from 'react';

export function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        setValue(storedValue);
      } catch (error) {
        console.error(error);
        setValue(initialValue);
      }
    }
  }, [key, initialValue]);

  return [value];
}