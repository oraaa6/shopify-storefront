import { useEffect, useCallback } from 'react';

export function useDebounce(func: () => void, dependencies: unknown[], delay: number) {
  const callback = useCallback(func, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
