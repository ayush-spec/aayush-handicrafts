/**
 * Looks up an Indian PIN code via api.postalpincode.in (a free public API
 * wrapping India Post data) and returns the canonical district + state.
 *
 * Returns a discriminated union so callers can distinguish "we couldn't
 * reach the API" (graceful — let the user type city/state manually) from
 * "the PIN doesn't exist" (loud — they likely typed it wrong).
 */
export type PincodeLookup =
  | { ok: true; city: string; state: string }
  | { ok: false; reason: 'invalid' | 'unavailable' };

interface ApiPostOffice {
  District: string;
  State: string;
}
interface ApiResponseItem {
  Status: 'Success' | 'Error' | '404';
  PostOffice: ApiPostOffice[] | null;
}

export async function lookupPincode(code: string): Promise<PincodeLookup> {
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, reason: 'invalid' };
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
      // Public API; client-side fetch. Keep it short — we don't want to
      // block the form for ages if the API is slow.
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return { ok: false, reason: 'unavailable' };

    const data: ApiResponseItem[] = await res.json();
    const entry = Array.isArray(data) ? data[0] : null;
    if (!entry || entry.Status !== 'Success' || !entry.PostOffice?.[0]) {
      return { ok: false, reason: 'invalid' };
    }

    return {
      ok: true,
      city: entry.PostOffice[0].District,
      state: entry.PostOffice[0].State,
    };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}
