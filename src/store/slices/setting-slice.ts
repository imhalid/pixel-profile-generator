import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingState  {
  screenEffect: boolean;
  pixelateAvatar: boolean;
  includeAllCommits: boolean;
  themeName: '' | 'journey' | 'road' | 'fuji' | 'monica' | 'summer' | 'lax';
}

const initialState: SettingState = {
  screenEffect: true,
  pixelateAvatar: false,
  includeAllCommits: true,
  themeName: ''
};

const setting = createSlice({
  name: "setting",
  initialState,
  reducers: {
    toggleOption: (
      state,
      action: PayloadAction<keyof Omit<SettingState, 'themeName'>>
    ) => {
      state[action.payload] = !state[action.payload];
    },
    setTheme: (
      state,
      action: PayloadAction<SettingState['themeName']>
    ) => {
      state.themeName = action.payload;
    },
  },
});

export const { toggleOption, setTheme } = setting.actions;

export default setting.reducer;