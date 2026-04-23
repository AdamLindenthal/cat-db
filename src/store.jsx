import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SEED_CATS } from './data/seeds';

const STORAGE_KEY = 'cat-db-v1';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.cats?.length > 0) return parsed;
    }
  } catch {}
  return { cats: SEED_CATS };
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addCat = useCallback((cat) => {
    const id = `cat-${Date.now()}`;
    const newCat = { ...cat, id, createdAt: new Date().toISOString() };
    setData(d => ({ ...d, cats: [...d.cats, newCat] }));
    return id;
  }, []);

  const updateCat = useCallback((id, updates) => {
    setData(d => ({ ...d, cats: d.cats.map(c => c.id === id ? { ...c, ...updates } : c) }));
  }, []);

  const deleteCat = useCallback((id) => {
    setData(d => ({
      ...d,
      cats: d.cats
        .filter(c => c.id !== id)
        .map(c => ({ ...c, associates: (c.associates || []).filter(a => a !== id) })),
    }));
  }, []);

  const exportData = useCallback(() => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      cats: data.cats,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cat-db-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          const cats = imported.cats ?? imported;
          if (!Array.isArray(cats)) throw new Error('Expected cats array');
          setData({ cats });
          resolve(cats.length);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }, []);

  return (
    <StoreContext.Provider value={{ cats: data.cats, addCat, updateCat, deleteCat, exportData, importData }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
