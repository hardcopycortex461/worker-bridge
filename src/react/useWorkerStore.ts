import { useState, useEffect } from 'react';
import { workerStore } from '../bridge/workerStore';

/**
 * A React hook that subscribes to worker state updates.
 * 
 * @param key The state key to subscribe to.
 * @param bridgeName The name of the bridge (defaults to 'default').
 * @returns The current state or null if not yet received.
 */
export function useWorkerStore<T>(key: string, bridgeName: string = "default"): T | null {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    const sub = workerStore<T>(key, bridgeName).subscribe((value: T) => {
      setState(value);
    });
    return () => sub.unsubscribe();
  }, [key, bridgeName]);

  return state;
}
