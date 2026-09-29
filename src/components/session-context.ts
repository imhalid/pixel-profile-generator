import { createContext, useContext } from 'react'
import type { Scheme } from '../lib/card-config'
import type { HistoryEntry } from '../lib/history-db'

export type LoadStatus = 'idle' | 'loading' | 'error'

export interface Session {
  /** Last successfully rendered URL per card. */
  shown: Record<Scheme, string | null>
  status: LoadStatus
  error: string | null
  startedAt: number | null
  /** URL for the current editor state of the active card. */
  currentUrl: string
  generate: () => void
  cancel: () => void
  history: HistoryEntry[]
  historyAvailable: boolean
  restore: (entry: HistoryEntry) => void
  remove: (id: string) => void
  clear: () => void
}

export const SessionContext = createContext<Session | null>(null)

export const useSession = () => {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return ctx
}

