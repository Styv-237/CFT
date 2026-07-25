"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebouncedValue } from "@/hooks/use-debounced-value";

/**
 * Keeps a local filter form in sync with the URL query string, debounced so
 * typing doesn't trigger a navigation on every keystroke. Selecting a value
 * from a dropdown still goes through the same debounce for simplicity, but
 * the delay is short enough to feel instant.
 */
export function useFilterParams(debounceMs = 350) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const initial = React.useMemo(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const [values, setValues] = React.useState<Record<string, string>>(initial);
  const debouncedValues = useDebouncedValue(values, debounceMs);
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(debouncedValues)) {
      if (value) params.set(key, value);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues]);

  const setValue = React.useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value, page: "" }));
  }, []);

  const reset = React.useCallback(() => setValues({}), []);

  return { values, setValue, reset, isPending };
}
