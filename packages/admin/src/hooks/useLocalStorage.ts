import React from 'react';

export const useLocalStorage = (key: string, defaultValue?: string) => {
  // initialize the value from localStorage
  const [currentValue, setCurrentValue] = React.useState<string | null>(() =>
    localStorage.getItem(key)
  );

  React.useEffect(() => {
    try {
      if (!JSON.parse(currentValue) && defaultValue) {
        localStorage.setItem(key, defaultValue);
        setCurrentValue(defaultValue);
      }
    } catch (e) {}
  }, []);

  // on every render, re-subscribe to the storage event
  React.useEffect(() => {
    const handler = (e: StorageEvent) => {
      console.log(e)

      if (e.storageArea === localStorage && e.key === key) {
        setCurrentValue(e.newValue);
      }
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  // update localStorage when the currentValue changes via setCurrentValue
  React.useEffect(() => {
    localStorage.setItem(key, currentValue);
  }, [key, currentValue]);

  // use as const to tell TypeScript this is a tuple
  return [currentValue, setCurrentValue] as const;
};