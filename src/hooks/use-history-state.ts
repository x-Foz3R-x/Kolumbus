import { useCallback, useMemo, useRef, useState } from "react";
import deepEqual from "deep-equal";

type Options = { initialDescription?: string; limit?: number; keepInitial?: boolean };
type HistoryProps<T> = {
  /** The initially passed value. */
  initialValue: T;
  /** An array of descriptive changes made in history. */
  changes: string[];
  /** Whether an undo operation can be performed. */
  canUndo: boolean;
  /** Whether a redo operation can be performed. */
  canRedo: boolean;
  /** A function to undo the last change to the state. */
  undo: () => void;
  /** A function to redo the last undone change to the state. */
  redo: () => void;
  /** A function to jump to a specific point in the history. */
  jumpTo: (index: number) => void;
  /** A function to add a new entry to the history. */
  addEntry: (value: T, desc: string) => void;
  /** A function to get an entry value from the history. */
  getEntry: (index: number) => T;
  /** A function to remove an entry from the history. */
  removeEntry: (index: number) => void;
  /** A function to get the entire history. */
  getHistory: () => Array<{ value: T; desc: string }>;
  /** A function to replace the entire history. */
  replaceHistory: (newHistory: Array<{ value: T; desc: string }>) => void;
  /** A function to handle undo/redo keyboard shortcuts. */
  handleShortcut: (e: KeyboardEvent) => void;
};

/**
 * Custom hook that extends useState with history tracking capabilities.
 *
 * @param initialValue - The initial value.
 * @param options - Optional configuration options.
 * @param options.initialDescription - The initial description for the first history entry. Default is "Open".
 * @param options.limit - The maximum number of history entries to keep. Default is 20.
 * @param options.keepInitial - Whether to not overwrite the initial value as the history goes on. Default is false.
 * @returns An array containing the state, and an object with history-related functions and properties.
 */
export default function useHistoryState<T>(
  initialValue: T,
  { initialDescription = "Open", limit = 20, keepInitial = false }: Options = {},
): [T, (valueOrIndex: T | number, desc?: string) => void, HistoryProps<T>] {
  const [value, setValue] = useState<T>(initialValue);
  const [history, setHistory] = useState<Array<{ value: T; desc: string }>>([
    { value: structuredClone(initialValue), desc: initialDescription },
  ]);
  const [index, setIndex] = useState(0);

  const changes = useMemo(() => history.map((entry) => entry.desc), [history]);
  const initialValueRef = useRef(initialValue);

  // Undo function to go back in the history
  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      setValue(history[index - 1]!.value);
    }
  }, [index, history]);

  // Redo function to go forward in the history
  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      setValue(history[index + 1]!.value);
    }
  }, [index, history]);

  // Jump to a specific index in the history
  const jumpTo = useCallback(
    (index: number) => {
      index = Math.max(0, Math.min(history.length - 1, index < 0 ? history.length + index : index));
      setIndex(index);
      setValue(history[index]!.value);
    },
    [history],
  );

  // Add a new entry to the history
  const addEntry = useCallback(
    (value: T, desc: string) => {
      // If the new value is the same as the last one in the history, return
      if (deepEqual(history[index]?.value, value)) return;

      const newHistory = [...history.slice(0, index + 1), { value: structuredClone(value), desc }];

      if (newHistory.length > limit) {
        const startIndex = keepInitial && newHistory.length > 1 ? 1 : 0;
        newHistory.splice(startIndex, 1);
      }

      setHistory(newHistory);
      setIndex(newHistory.length - 1);
    },
    [history, index, limit, keepInitial],
  );

  // Get a specific entry in the history
  const getEntry = useCallback(
    (index: number) => {
      index = Math.max(0, Math.min(history.length - 1, index < 0 ? history.length + index : index));
      return structuredClone(history[index]!.value);
    },
    [history],
  );

  // Remove an entry from the history
  const removeEntry = useCallback(
    (index: number) => {
      if (index < -(history.length - 1) || index >= history.length) return undefined;
      if (index < 0) index = history.length + index;

      const newHistory = structuredClone(history);
      newHistory.splice(index, 1);
      setHistory(newHistory);
    },
    [history],
  );

  // Set a new value or get it from the history. (used as setter for useState)
  const updateValue = useCallback(
    (valueOrIndex: T | number, desc?: string) => {
      // Updates the value or gets an entry from the history to update value.
      // If a number is passed, it gets the corresponding entry from the history.
      // If a non-number value and a description are passed, it adds a new entry to the history.

      setValue(typeof valueOrIndex === "number" ? getEntry(valueOrIndex) : valueOrIndex);
      if (!!desc && typeof valueOrIndex !== "number") addEntry(valueOrIndex, desc);
    },
    [addEntry, getEntry],
  );

  // Get the entire history
  const getHistory = useCallback(() => {
    return structuredClone(history);
  }, [history]);

  // Replace the entire history
  const replaceHistory = useCallback((newHistory: Array<{ value: T; desc: string }>) => {
    const history = structuredClone(newHistory);
    setHistory(history);
    setIndex(history.length - 1);
  }, []);

  // Handle keyboard shortcuts for undo and redo
  const handleShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();

        if (e.shiftKey) redo();
        else undo();
      }
    },
    [undo, redo],
  );

  return [
    value,
    updateValue,
    {
      initialValue: initialValueRef.current,
      changes,
      canUndo: index > 0,
      canRedo: index < history.length - 1,
      undo,
      redo,
      jumpTo,
      addEntry,
      getEntry,
      removeEntry,
      getHistory,
      replaceHistory,
      handleShortcut,
    },
  ] as const;
}
