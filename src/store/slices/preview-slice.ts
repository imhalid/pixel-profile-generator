import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PreviewState = {
  rotation: number;
  firstColor: string;
  firstColorPosition: number;
  firstColorOpacity: string;
  secondColor: string;
  secondColorPosition: number;
  secondColorOpacity: string;
  userName: string;
};

const initialState: PreviewState = {
  rotation: 0,
  firstColor: "#239063",
  firstColorPosition: 0,
  firstColorOpacity: 'FF',
  secondColor: "#91db69",
  secondColorPosition: 100,
  secondColorOpacity: 'FF',
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
    setFirstColorOpacity: (state, action: PayloadAction<string>) => {
      state.firstColorOpacity = action.payload;
    },
    setSecondColor: (state, action: PayloadAction<string>) => {
      state.secondColor = action.payload;
    },
    setSecondColorPosition: (state, action: PayloadAction<number>) => {
      state.secondColorPosition = action.payload;
    },
    setSecondColorOpacity: (state, action: PayloadAction<string>) => {
      state.secondColorOpacity = action.payload;
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
  setFirstColorOpacity,
  setSecondColor,
  setSecondColorPosition,
  setSecondColorOpacity,
  setUserName,
} = previewSlice.actions;

export default previewSlice.reducer;
