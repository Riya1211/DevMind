import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { entryApi } from "./api/entryAPI";

export const store = configureStore({
  reducer: {
    // RTK Query needs its reducer registered here
    [authApi.reducerPath]: authApi.reducer,
    [entryApi.reducerPath]: entryApi.reducer,
  },
  // RTK Query needs its middleware for caching to work
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(entryApi.middleware),
});
