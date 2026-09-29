import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Scheme, buildUrl } from '../lib/card-config'
import { LoadStatus, Session, SessionContext } from './session-context'
import {
  HistoryEntry,
  addHistory,
  clearHistory,
  listHistory,
  removeHistory,
} from '../lib/history-db'
import { restoreCard, setScheme } from '../store/editor-slice'
import store, { useAppDispatch, useAppSelector } from '../store/store'

// The API can take a while on a cold start, but it should never take this long.
const TIMEOUT_MS = 45_000

/** Loads an image URL, resolving only when the browser decoded a real image. */
const loadImage = (url: string, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const img = new Image()
    const timer = window.setTimeout(() => {
      img.src = ''
      reject(new Error('The API took too long to answer. Try again in a moment.'))
    }, TIMEOUT_MS)
    const done = (fn: () => void) => () => {
      window.clearTimeout(timer)
      fn()
    }
    img.onload = done(() =>
      img.naturalWidth > 0
        ? resolve()
        : reject(new Error('The API returned an empty image.'))
    )
    // The API answers errors with an empty HTML page, which fires onerror.
    img.onerror = done(() =>
      reject(
        new Error(
          'No card came back. Check the username, or the API may be busy.'
        )
      )
    )
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer)
      img.src = ''
      reject(new DOMException('aborted', 'AbortError'))
    })
    img.src = url
  })

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch()
  const card = useAppSelector(s => s.editor.cards[s.editor.scheme])
  const shared = useAppSelector(s => s.editor.shared)
  const currentUrl = useMemo(() => buildUrl(card, shared), [card, shared])

  const [shown, setShown] = useState<Record<Scheme, string | null>>({
    light: null,
    dark: null,
  })
  const [status, setStatus] = useState<LoadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyAvailable, setHistoryAvailable] = useState(true)

  const refreshHistory = useCallback(() => {
    listHistory()
      .then(setHistory)
      .catch(() => setHistoryAvailable(false))
  }, [])

  useEffect(refreshHistory, [refreshHistory])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setStatus('idle')
    setStartedAt(null)
  }, [])

  const generate = useCallback(() => {
    // Read from the store so the snapshot saved to history matches the request.
    const { editor } = store.getState()
    const target = editor.scheme
    const snapshotCard = structuredClone(editor.cards[target])
    const snapshotShared = structuredClone(editor.shared)
    const url = buildUrl(snapshotCard, snapshotShared)

    if (!snapshotShared.username.trim()) {
      setStatus('error')
      setError('Enter a GitHub username first.')
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setStatus('loading')
    setError(null)
    setStartedAt(Date.now())

    loadImage(url, controller.signal)
      .then(() => {
        if (controller.signal.aborted) return
        setShown(prev =>
          editor.linked ? { light: url, dark: url } : { ...prev, [target]: url }
        )
        setStatus('idle')
        setStartedAt(null)
        return addHistory({
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          url,
          scheme: target,
          card: snapshotCard,
          shared: snapshotShared,
        })
          .then(refreshHistory)
          .catch(() => setHistoryAvailable(false))
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return
        setStatus('error')
        setError(err.message)
        setStartedAt(null)
      })
  }, [refreshHistory])

  // Render whatever card was saved from the last visit.
  const didInit = useRef(false)
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    generate()
  }, [generate])

  const restore = useCallback(
    (entry: HistoryEntry) => {
      dispatch(setScheme(entry.scheme))
      dispatch(restoreCard({ card: entry.card, shared: entry.shared }))
      abortRef.current?.abort()
      setStatus('idle')
      setError(null)
      const both = store.getState().editor.linked
      setShown(prev =>
        both ? { light: entry.url, dark: entry.url } : { ...prev, [entry.scheme]: entry.url }
      )
    },
    [dispatch]
  )

  const remove = useCallback(
    (id: string) => {
      removeHistory(id).then(refreshHistory).catch(() => setHistoryAvailable(false))
    },
    [refreshHistory]
  )

  const clear = useCallback(() => {
    clearHistory().then(refreshHistory).catch(() => setHistoryAvailable(false))
  }, [refreshHistory])

  const value: Session = {
    shown,
    status,
    error,
    startedAt,
    currentUrl,
    generate,
    cancel,
    history,
    historyAvailable,
    restore,
    remove,
    clear,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
