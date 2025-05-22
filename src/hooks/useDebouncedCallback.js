import { useRef } from "react";

export function useDebounceCallback(callback, delay) {
  const timerRef = useRef(null);

  return (...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
