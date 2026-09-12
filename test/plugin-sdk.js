// A test double for the host's `@orgasmic/plugin-sdk`.
//
// Plugins run inside the Orgasmic app, which supplies this module at runtime.
// Tests here run outside it, so this file provides the smallest honest stand-in:
// real hook behaviour where a test depends on it, plain elements for the rest.
// Keep it in step with the host SDK; a plugin that needs more of the SDK than
// this file offers should add it here rather than mock it per test.
import { createElement as h, useEffect, useRef, useState } from 'react';

const strip = ({ variant, size, ...props }) => props;

export const Button = (props) => h('button', { type: 'button', ...strip(props) });
export const Input = (props) => h('input', strip(props));
export const Textarea = (props) => h('textarea', strip(props));

/** The host grants every capability under test; a test that needs a denial passes its own ctx. */
export const useMe = () => ({ can: () => true });

/** The host pushes graph events; tests drive components directly instead. */
export const useEventStream = () => {};

/** Milliseconds as `m:ss`, matching the host. */
export function mediaTime(ms) {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/** Chunked upload is the host's; no ported test exercises it. */
export async function uploadAttachment() {
  throw new Error('uploadAttachment is not stubbed for tests');
}

/** Fetch on mount, expose `refresh`, and drop a reply that lost its race. */
export function useResource(key, fetcher, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const scope = useRef(null);

  const refresh = useRef(async () => {
    const current = scope.current;
    if (current === null) return;
    setLoading(true);
    try {
      const next = await fetcherRef.current();
      if (scope.current !== current) return;
      setData(next);
      setError(null);
    } catch (caught) {
      if (scope.current !== current) return;
      setError(caught);
    } finally {
      if (scope.current === current) setLoading(false);
    }
  }).current;

  useEffect(() => {
    if (!enabled) {
      scope.current = null;
      return undefined;
    }
    scope.current = Symbol(key);
    void refresh();
    return () => {
      scope.current = null;
    };
  }, [key, enabled, refresh]);

  return { data, error, loading, refresh };
}
