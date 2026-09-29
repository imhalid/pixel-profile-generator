import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import editorReducer, { EditorState, initialEditorState } from './editor-slice'

const STORAGE_KEY = 'pixel-profile-generator:editor:v2'

// Remembering the last card is a per-browser convenience, so any storage
// failure (private mode, quota, old shape) just falls back to defaults.
const loadEditor = (): EditorState | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const saved = JSON.parse(raw) as EditorState
    const base = initialEditorState()
    return {
      ...base,
      ...saved,
      shared: { ...base.shared, ...saved.shared },
      cards: {
        light: { ...base.cards.light, ...saved.cards?.light },
        dark: { ...base.cards.dark, ...saved.cards?.dark },
      },
    }
  } catch {
    return undefined
  }
}

const preloaded = loadEditor()

const store = configureStore({
  reducer: { editor: editorReducer },
  preloadedState: preloaded ? { editor: preloaded } : undefined,
})

let saveTimer: number | undefined
store.subscribe(() => {
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().editor))
    } catch {
      /* ignore */
    }
  }, 300)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/** The card currently being edited. */
export const useActiveCard = () =>
  useAppSelector(s => s.editor.cards[s.editor.scheme])

export default store
