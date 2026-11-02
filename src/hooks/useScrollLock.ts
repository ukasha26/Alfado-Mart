import { useEffect, useRef } from "react";

let lockCount = 0;

export function useScrollLock(locked: boolean) {
  const originalStyle = useRef<string>("");

  useEffect(() => {
    if (locked) {
      if (lockCount === 0) {
        originalStyle.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
      lockCount++;
      return () => {
        lockCount--;
        if (lockCount <= 0) {
          document.body.style.overflow = originalStyle.current;
          lockCount = 0;
        }
      };
    }
  }, [locked]);
}
