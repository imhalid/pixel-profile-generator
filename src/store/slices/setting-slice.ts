import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface BooleanSettingState {
  screenEffect: boolean
  pixelateAvatar: boolean
  dithering: boolean
  includeAllCommits: boolean
}

// Valid hide keys for stats
export type HideStatKey = 'avatar' | 'commits' | 'contributions' | 'issues' | 'prs' | 'rank' | 'stars';

export interface SettingState extends BooleanSettingState {
  themeName:
  | '--'
  | 'journey'
  | 'road_trip'
  | 'fuji'
  | 'monica'
  | 'summer'
  | 'lax'
  | 'crt'
  stats: HideStatKey[]
}

const initialState: SettingState = {
  screenEffect: true,
  pixelateAvatar: true,
  dithering: true,
  includeAllCommits: true,
  themeName: '--',
  stats: [], // Only valid: 'avatar', 'commits', 'contributions', 'issues', 'prs', 'rank', 'stars'
}

const setting = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    toggleOption: (state, action: PayloadAction<keyof BooleanSettingState>) => {
      const key = action.payload
      if (typeof state[key] === 'boolean') {
        state[key] = !state[key]
      }
    },
    setTheme: (state, action: PayloadAction<SettingState['themeName']>) => {
      state.themeName = action.payload
    },
    setHideStats: (state, action: PayloadAction<SettingState['stats']>) => {
      state.stats = action.payload
    },
  },
})

export const { toggleOption, setTheme, setHideStats } = setting.actions

export default setting.reducer
