import { useCallback, useEffect, useRef, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type UseAsyncResult<T> = AsyncState<T> & {
  reload: () => void;
};

/**
 * Runs an async function and tracks its loading/error/data state.
 * Uses the "latest ref" pattern so the hook always calls the most
 * recent version of asyncFn without re-subscribing on every render.
 *
 * reload() re-triggers the request manually (e.g. after an error).
 */
export const useAsync = <T>(asyncFn: () => Promise<T>): UseAsyncResult<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const [reloadKey, setReloadKey] = useState(0);

  // Keep a stable ref to always call the latest version of asyncFn
  const asyncFnRef = useRef(asyncFn);

  asyncFnRef.current = asyncFn;

  const reload = useCallback(() => setReloadKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    setState(s => ({ ...s, loading: true, error: null }));

    asyncFnRef
      .current()
      .then(data => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Something went wrong';

          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
    // reloadKey is the only intentional trigger; asyncFn is tracked via ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  return { ...state, reload };
};
