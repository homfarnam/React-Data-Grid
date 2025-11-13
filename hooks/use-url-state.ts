'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useUrlState = <T>(
  key: 'columns' | 'pageSize' | 'page' | 'filters' | 'favourites',
  defaultValue: T,
  options?: { alwaysInUrl?: boolean; debounceMs?: number }
): [T, (value: T | ((prev: T) => T)) => void] => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const previousValueRef = useRef<string>('');

  const param = searchParams.get(key);
  let initialState: T = defaultValue;

  if (param) {
    try {
      const decoded = JSON.parse(decodeURIComponent(param)) as T;
      previousValueRef.current = JSON.stringify(decoded);
      initialState = decoded;
    } catch (error) {
      console.error(`Error parsing URL param "${key}":`, error);
    }
  }

  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const currentValue = JSON.stringify(state);

    const wasInitialMount = isInitialMount.current;
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    if (currentValue === previousValueRef.current) {
      return;
    }

    if (wasInitialMount) {
      previousValueRef.current = currentValue;

      const param = searchParams.get(key);

      if (options?.alwaysInUrl && !param) {
        const params = new URLSearchParams(searchParams.toString());
        const encodedValue = encodeURIComponent(currentValue);
        params.set(key, encodedValue);
        const newUrl = `${pathname}?${params.toString()}`;
        router.replace(newUrl, { scroll: false });
      }
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const debounceMs = options?.debounceMs ?? 0;

    const updateUrl = () => {
      const params = new URLSearchParams(searchParams.toString());

      try {
        const defaultValueStr = JSON.stringify(defaultValue);

        if (options?.alwaysInUrl) {
          const encodedValue = encodeURIComponent(currentValue);
          params.set(key, encodedValue);
        } else {
          if (currentValue === defaultValueStr) {
            params.delete(key);
          } else {
            const encodedValue = encodeURIComponent(currentValue);
            params.set(key, encodedValue);
          }
        }

        const newUrl = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;

        previousValueRef.current = currentValue;

        try {
          router.replace(newUrl, { scroll: false });
        } catch (error) {
          console.warn(`Router replace failed for "${key}":`, error);
        }
      } catch (error) {
        console.warn(`Error updating URL param "${key}":`, error);
      }
    };

    if (debounceMs > 0) {
      timeoutRef.current = setTimeout(updateUrl, debounceMs);
    } else {
      updateUrl();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    state,
    key,
    pathname,
    router,
    defaultValue,
    options?.alwaysInUrl,
    options?.debounceMs,
    searchParams,
    options,
  ]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      return value instanceof Function ? value(prev) : value;
    });
  }, []);

  return [state, setValue];
};
