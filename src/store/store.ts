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

