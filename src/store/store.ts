import { configureStore } from "@reduxjs/toolkit";
import optionsSlice from "./slices/preview-slice";
import settingSlice from "./slices/setting-slice";

const store = configureStore({
  reducer: {
    options: optionsSlice,
    setting: settingSlice,
  },
});

export default store;
