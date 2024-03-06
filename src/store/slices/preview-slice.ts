import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PreviewState = {
  rotation: number;
  firstColor: string;
  firstColorPosition: number;
  secondColor: string;
  secondColorPosition: number;
  userName: string;
};

const initialState: PreviewState = {
  rotation: 0,
  firstColor: "#239063",
  firstColorPosition: 0,
  secondColor: "#91db69",
  secondColorPosition: 100,
  userName: "imhalid",
};

const previewSlice = createSlice({
  name: "preview",
  initialState,
  reducers: {
    setRotation: (state, action: PayloadAction<number>) => {
      state.rotation = action.payload;
    },
    setFirstColor: (state, action: PayloadAction<string>) => {
      state.firstColor = action.payload;
    },
    setFirstColorPosition: (state, action: PayloadAction<number>) => {
      state.firstColorPosition = action.payload;
    },
    setSecondColor: (state, action: PayloadAction<string>) => {
      state.secondColor = action.payload;
    },
    setSecondColorPosition: (state, action: PayloadAction<number>) => {
      state.secondColorPosition = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
  },
});

export const {
  setRotation,
  setFirstColor,
  setFirstColorPosition,
  setSecondColor,
  setSecondColorPosition,
  setUserName,
} = previewSlice.actions;

export default previewSlice.reducer;
