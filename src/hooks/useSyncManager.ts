import { useEffect, useCallback } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { toast } from 'sonner';

const RECIPES_STORAGE_KEY = 'recipe-keeper-recipes';
const ENTRIES_STORAGE_KEY = 'recipe-keeper-made-entries';

export const useSyncManager = () => {
  const isOnline = useOnlineStatus();

  const syncData = useCallback(async () => {
    if (!isOnline) return;

    try {
      // Get unsynced recipes
      const recipesData = localStorage.getItem(RECIPES_STORAGE_KEY);
      const entriesData = localStorage.getItem(ENTRIES_STORAGE_KEY);
      
      let hasUnsynced = false;

      if (recipesData) {
        const recipes = JSON.parse(recipesData);
        const unsyncedRecipes = recipes.filter((r: any) => !r.synced);
        
        if (unsyncedRecipes.length > 0) {
          hasUnsynced = true;
          // Simulate API sync
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mark as synced
          const syncedRecipes = recipes.map((r: any) => ({ ...r, synced: true }));
          localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(syncedRecipes));
        }
      }

      if (entriesData) {
        const entries = JSON.parse(entriesData);
        const unsyncedEntries = entries.filter((e: any) => !e.synced);
        
        if (unsyncedEntries.length > 0) {
          hasUnsynced = true;
          // Simulate API sync
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mark as synced
          const syncedEntries = entries.map((e: any) => ({ ...e, synced: true }));
          localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(syncedEntries));
        }
      }

      if (hasUnsynced) {
        toast.success('All changes synced!');
        // Trigger a storage event to update all components
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed. Will retry when online.');
    }
  }, [isOnline]);

  // Sync when coming back online
  useEffect(() => {
    if (isOnline) {
      syncData();
    }
  }, [isOnline, syncData]);

  // Periodic sync every 30 seconds when online
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(syncData, 30000);
    return () => clearInterval(interval);
  }, [isOnline, syncData]);

  return { isOnline, syncData };
};
