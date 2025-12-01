import { useState, useEffect } from 'react';
import { MadeEntry, MadeEntryInput } from '@/types/recipe';

const STORAGE_KEY = 'recipe-keeper-made-entries';

export const useMadeEntries = () => {
  const [entries, setEntries] = useState<MadeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const entriesWithDates = parsed.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt)
      }));
      setEntries(entriesWithDates);
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever entries change
  const saveEntries = (updatedEntries: MadeEntry[]) => {
    setEntries(updatedEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  };

  const addMadeEntry = (entryInput: MadeEntryInput) => {
    const newEntry: MadeEntry = {
      ...entryInput,
      id: Date.now().toString(),
      createdAt: new Date(),
      synced: false
    };
    saveEntries([newEntry, ...entries]);
    return newEntry;
  };

  const getEntriesForRecipe = (recipeId: string) => {
    return entries.filter(entry => entry.recipeId === recipeId);
  };

  const getAverageGrade = (recipeId: string) => {
    const recipeEntries = getEntriesForRecipe(recipeId);
    if (recipeEntries.length === 0) return null;
    const sum = recipeEntries.reduce((acc, entry) => acc + entry.grade, 0);
    return sum / recipeEntries.length;
  };

  // Listen for storage events to refresh data when synced
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt)
        }));
        setEntries(entriesWithDates);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    entries,
    loading,
    addMadeEntry,
    getEntriesForRecipe,
    getAverageGrade
  };
};
