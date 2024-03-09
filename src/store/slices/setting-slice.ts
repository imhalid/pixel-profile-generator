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
  properties: string[];
}

const initialState: SettingState = {
  screenEffect: true,
  pixelateAvatar: false,
  includeAllCommits: true,
  themeName: '--',
  properties: []
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
    setHideProperties: (state, action: PayloadAction<SettingState["properties"]>) => {
      state.properties = action.payload;
    }
  },
});

export const { toggleOption, setTheme, setHideProperties } = setting.actions;

export default setting.reducer;