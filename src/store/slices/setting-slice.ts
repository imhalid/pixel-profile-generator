import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BooleanSettingState {
  screenEffect: boolean;
  pixelateAvatar: boolean;
  includeAllCommits: boolean;
}

export interface SettingState extends BooleanSettingState {
  themeName:
  | "--"
  | "journey"
  | "road_trip"
  | "fuji"
  | "monica"
  | "summer"
  | "lax";
  stats: string[];
  currentStore: object;
}

const initialState: SettingState = {
  screenEffect: true,
  pixelateAvatar: false,
  includeAllCommits: true,
  themeName: '--',
  stats: [],
  currentStore: {}
};

const setting = createSlice({
  name: "setting",
  initialState,
  reducers: {
    toggleOption: (state, action: PayloadAction<keyof BooleanSettingState>) => {
      const key = action.payload;
      if (typeof state[key] === "boolean") {
        state[key] = !state[key];
      }
    },
    setTheme: (state, action: PayloadAction<SettingState["themeName"]>) => {
      state.themeName = action.payload;
    },
    setHideStats: (state, action: PayloadAction<SettingState["stats"]>) => {
      state.stats = action.payload;
    },
    setCurrentStore: (state, action: PayloadAction<SettingState["currentStore"]>) => {
      state.currentStore = action.payload;
    }
  },
});

export const { toggleOption, setTheme, setHideStats, setCurrentStore } = setting.actions;

export default setting.reducer;