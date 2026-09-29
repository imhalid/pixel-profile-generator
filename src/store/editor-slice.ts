import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CardConfig,
  Scheme,
  SharedConfig,
  defaultCard,
  defaultShared,
} from '../lib/card-config'
import {
  ColorStop,
  GradientConfig,
  clamp,
  colorAt,
  newStopId,
} from '../lib/gradient'

export interface EditorState {
  shared: SharedConfig
  cards: Record<Scheme, CardConfig>
  /** Which card the controls are editing. */
  scheme: Scheme
  /** Use the same card for light and dark mode. */
  linked: boolean
  /** Selected stop per scheme, for the gradient editor. */
  selectedStop: Record<Scheme, string | null>
}

export const initialEditorState = (): EditorState => {
  const light = defaultCard()
  const dark = defaultCard()
  return {
    shared: defaultShared(),
    cards: { light, dark },
    scheme: 'dark',
    linked: true,
    selectedStop: {
      light: light.gradient.stops[0].id,
      dark: dark.gradient.stops[0].id,
    },
  }
}

// When linked, every edit goes to both cards so they never drift apart.
const targets = (state: EditorState): Scheme[] =>
  state.linked ? ['light', 'dark'] : [state.scheme]

const editCards = (state: EditorState, fn: (card: CardConfig) => void) => {
  for (const s of targets(state)) fn(state.cards[s])
}

const editor = createSlice({
  name: 'editor',
  initialState: initialEditorState,
  reducers: {
    setShared: (state, action: PayloadAction<Partial<SharedConfig>>) => {
      Object.assign(state.shared, action.payload)
    },
    setScheme: (state, action: PayloadAction<Scheme>) => {
      state.scheme = action.payload
    },
    setLinked: (state, action: PayloadAction<boolean>) => {
      state.linked = action.payload
      if (action.payload) {
        // Linking copies the card being edited onto the other one.
        const other: Scheme = state.scheme === 'light' ? 'dark' : 'light'
        state.cards[other] = structuredClone(state.cards[state.scheme])
        state.selectedStop[other] = state.selectedStop[state.scheme]
      }
    },
    copyCardFromOther: state => {
      const other: Scheme = state.scheme === 'light' ? 'dark' : 'light'
      state.cards[state.scheme] = structuredClone(state.cards[other])
      state.selectedStop[state.scheme] = state.selectedStop[other]
    },
    updateCard: (state, action: PayloadAction<Partial<CardConfig>>) => {
      editCards(state, c => Object.assign(c, action.payload))
    },
    toggleHide: (state, action: PayloadAction<CardConfig['hide'][number]>) => {
      editCards(state, c => {
        c.hide = c.hide.includes(action.payload)
          ? c.hide.filter(k => k !== action.payload)
          : [...c.hide, action.payload]
      })
    },
    updateGradient: (state, action: PayloadAction<Partial<GradientConfig>>) => {
      editCards(state, c => Object.assign(c.gradient, action.payload))
    },
    setGradient: (state, action: PayloadAction<GradientConfig>) => {
      const stops = action.payload.stops.map(s => ({ ...s, id: newStopId() }))
      editCards(state, c => {
        c.gradient = { ...structuredClone(action.payload), stops: structuredClone(stops) }
        c.theme = null
      })
      for (const s of targets(state)) state.selectedStop[s] = stops[0].id
    },
    selectStop: (state, action: PayloadAction<string | null>) => {
      for (const s of targets(state)) state.selectedStop[s] = action.payload
    },
    updateStop: (
      state,
      action: PayloadAction<{ id: string } & Partial<Omit<ColorStop, 'id'>>>
    ) => {
      const { id, ...patch } = action.payload
      if (patch.position !== undefined) patch.position = clamp(patch.position, 0, 100)
      editCards(state, c => {
        const stop = c.gradient.stops.find(s => s.id === id)
        if (stop) Object.assign(stop, patch)
      })
    },
    addStop: (state, action: PayloadAction<{ position: number; color?: string }>) => {
      const position = clamp(Math.round(action.payload.position), 0, 100)
      const current = state.cards[state.scheme].gradient.stops
      const stop: ColorStop = {
        id: newStopId(),
        position,
        color: action.payload.color ?? colorAt(current, position),
      }
      editCards(state, c => {
        if (c.gradient.stops.length < 8) c.gradient.stops.push({ ...stop })
      })
      for (const s of targets(state)) state.selectedStop[s] = stop.id
    },
    removeStop: (state, action: PayloadAction<string>) => {
      editCards(state, c => {
        if (c.gradient.stops.length > 2) {
          c.gradient.stops = c.gradient.stops.filter(s => s.id !== action.payload)
        }
      })
      for (const s of targets(state)) {
        if (state.selectedStop[s] === action.payload) {
          state.selectedStop[s] = state.cards[s].gradient.stops[0]?.id ?? null
        }
      }
    },
    reverseStops: state => {
      editCards(state, c => {
        for (const s of c.gradient.stops) s.position = 100 - s.position
      })
    },
    /** Restores a card from history into the scheme being edited. */
    restoreCard: (
      state,
      action: PayloadAction<{ card: CardConfig; shared: SharedConfig }>
    ) => {
      state.shared = structuredClone(action.payload.shared)
      editCards(state, c => Object.assign(c, structuredClone(action.payload.card)))
      for (const s of targets(state)) {
        state.selectedStop[s] = state.cards[s].gradient.stops[0]?.id ?? null
      }
    },
    /** Turns off the options the public API currently can't render. */
    disableHeavyEffects: state => {
      editCards(state, c => {
        c.screenEffect = false
        if (c.cardType === 'crt') c.cardType = 'stats'
        if (c.theme === 'crt') c.theme = null
      })
    },
    resetCard: state => {
      const fresh = defaultCard()
      editCards(state, c => Object.assign(c, structuredClone(fresh)))
      for (const s of targets(state)) state.selectedStop[s] = fresh.gradient.stops[0].id
    },
  },
})

export const {
  setShared,
  setScheme,
  setLinked,
  copyCardFromOther,
  updateCard,
  toggleHide,
  updateGradient,
  setGradient,
  selectStop,
  updateStop,
  addStop,
  removeStop,
  reverseStops,
  restoreCard,
  disableHeavyEffects,
  resetCard,
} = editor.actions

export default editor.reducer
