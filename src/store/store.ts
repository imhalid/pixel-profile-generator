import { configureStore } from "@reduxjs/toolkit";
import previewSlice from "./slices/preview-slice";
import settingSlice from "./slices/setting-slice";
import { PreviewState } from "./slices/preview-slice";
import { SettingState } from "./slices/setting-slice";
export interface RootState {
  preview: PreviewState;
  setting: SettingState;
}
const store = configureStore<RootState>({
  reducer: {
    preview: previewSlice,
    setting: settingSlice,
  },
});

export default store;


const defaultState = store.getState();
const odds = new Set([JSON.stringify(defaultState)])
store.subscribe(() => {
  console.log(store.getState().setting.currentStore)
  const state = store.getState();
  const squares = new Set([JSON.stringify(state)])
  const diff = odds.intersection(squares).size === 0
  // const intersection = Array.from(odds).filter(item => squares.has(item));
  // const diff = intersection.length === 0;
  console.log('State changed:', diff)
})