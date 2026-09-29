import type { CardConfig, Scheme, SharedConfig } from './card-config'

export interface HistoryEntry {
  id: string
  createdAt: number
  url: string
  scheme: Scheme
  card: CardConfig
  shared: SharedConfig
}

const DB_NAME = 'pixel-profile-generator'
const STORE = 'history'
const MAX_ENTRIES = 40

let dbPromise: Promise<IDBDatabase> | null = null

const openDb = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB is not available'))
        return
      }
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => {
        const store = req.result.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt')
        store.createIndex('url', 'url', { unique: false })
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    // Let a later call retry if opening failed (private mode, blocked, ...).
    dbPromise.catch(() => (dbPromise = null))
  }
  return dbPromise
}

const run = async <T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T | undefined> => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const req = fn(tx.objectStore(STORE))
    tx.oncomplete = () => resolve(req ? req.result : undefined)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export const listHistory = async (): Promise<HistoryEntry[]> => {
  const all = (await run<HistoryEntry[]>('readonly', s => s.getAll())) ?? []
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

/** Adds an entry, moving an existing one with the same URL to the top. */
export const addHistory = async (entry: HistoryEntry) => {
  const existing = await listHistory()
  const dupes = existing.filter(e => e.url === entry.url)
  const overflow = existing
    .filter(e => e.url !== entry.url)
    .slice(MAX_ENTRIES - 1)
  await run('readwrite', s => {
    for (const e of [...dupes, ...overflow]) s.delete(e.id)
    s.put(entry)
  })
}

export const removeHistory = (id: string) =>
  run('readwrite', s => s.delete(id))

export const clearHistory = () => run('readwrite', s => s.clear())
