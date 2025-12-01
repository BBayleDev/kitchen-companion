import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useState, useEffect } from 'react';

export const SyncIndicator = () => {
  const isOnline = useOnlineStatus();
  const [hasUnsynced, setHasUnsynced] = useState(false);

  useEffect(() => {
    const checkUnsyncedData = () => {
      const recipes = JSON.parse(localStorage.getItem('recipe-keeper-recipes') || '[]');
      const entries = JSON.parse(localStorage.getItem('recipe-keeper-made-entries') || '[]');
      
      const hasUnsyncedRecipes = recipes.some((r: any) => !r.synced);
      const hasUnsyncedEntries = entries.some((e: any) => !e.synced);
      
      setHasUnsynced(hasUnsyncedRecipes || hasUnsyncedEntries);
    };

    checkUnsyncedData();
    
    // Listen for storage changes
    window.addEventListener('storage', checkUnsyncedData);
    
    // Check periodically
    const interval = setInterval(checkUnsyncedData, 2000);

    return () => {
      window.removeEventListener('storage', checkUnsyncedData);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && !hasUnsynced) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-background/95 backdrop-blur-sm border border-border shadow-lg animate-in fade-in slide-in-from-top-2">
      {!isOnline ? (
        <>
          <WifiOff className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Offline Mode</span>
        </>
      ) : hasUnsynced ? (
        <>
          <Cloud className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Syncing...</span>
        </>
      ) : null}
    </div>
  );
};
