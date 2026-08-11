'use client';

import { useEffect, useRef, useState } from 'react';
import { lookupPincode } from '@/lib/utils/pincode';

export type PincodeStatus =
  | 'idle'
  | 'looking-up'
  | 'verified'
  | 'invalid'
  | 'unavailable';

/**
 * Watches a pincode string and fires an autofill callback once it reaches
 * 6 digits and matches a real PIN. The callback receives `{ city, state }`
 * and is up to the consumer to apply to its form state.
 *
 * The callback is stored in a ref so the consumer can pass an inline
 * arrow function without causing re-runs.
 */
export function usePincodeAutofill(
  pincode: string,
  applyResult: (result: { city: string; state: string }) => void
): PincodeStatus {
  const [status, setStatus] = useState<PincodeStatus>('idle');
  const applyRef = useRef(applyResult);
  applyRef.current = applyResult;
  const lastLookedUp = useRef<string | null>(null);

  useEffect(() => {
    if (pincode.length !== 6) {
      setStatus('idle');
      lastLookedUp.current = null;
      return;
    }
    if (lastLookedUp.current === pincode) return;

    let cancelled = false;
    lastLookedUp.current = pincode;
    setStatus('looking-up');

    lookupPincode(pincode).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setStatus(result.reason === 'invalid' ? 'invalid' : 'unavailable');
        return;
      }
      applyRef.current({ city: result.city, state: result.state });
      setStatus('verified');
    });

    return () => {
      cancelled = true;
    };
  }, [pincode]);

  return status;
}
