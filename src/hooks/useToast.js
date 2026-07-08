import { useCallback, useRef, useState } from 'react';

// Minimal toast manager: one message at a time, auto-dismiss after `duration` ms.
export function useToast(duration = 3200) {
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback(
    (msg) => {
      clearTimeout(timerRef.current);
      setMessage(msg);
      timerRef.current = setTimeout(() => setMessage(null), duration);
    },
    [duration]
  );

  return { message, showToast };
}
