import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingState  {
  screenEffect: boolean;
  pixelateAvatar: boolean;
  includeAllCommits: boolean;
}

const initialState: SettingState = {
  screenEffect: true,
  pixelateAvatar: false,
  includeAllCommits: true,
};

const setting = createSlice({
  name: "setting",
  initialState,
  reducers: {
    toggleOption: (state: SettingState, action: PayloadAction<keyof SettingState>) => {
      state[action.payload] = !state[action.payload];
    },
  },
});

export const { toggleOption } = setting.actions;

export default setting.reducer;