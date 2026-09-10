import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "@/redux/slices/layout.slice";
import homeReducer from "@/extensions/home/redux/home.slice";
import settingsReducer from "@/extensions/settings/redux/settings.slice";

const store = configureStore({
  reducer: {
    layout: layoutReducer,
    home: homeReducer,
    settings: settingsReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
