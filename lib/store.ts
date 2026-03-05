import type { StoredResult } from '@/types';

// Shared in-memory store (replace with DB in production)
// Using globalThis to survive hot-reload in Next.js dev
declare global {
  // eslint-disable-next-line no-var
  var __resultStore: Map<string, StoredResult> | undefined;
}

export const resultStore: Map<string, StoredResult> =
  globalThis.__resultStore ?? (globalThis.__resultStore = new Map());
