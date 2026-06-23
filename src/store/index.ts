import {
  AnyAction,
  combineReducers,
  configureStore,
  createAction,
} from "@reduxjs/toolkit";

import { apiSlice } from "@/store/apiSlice";
import maintenanceReducer from "@/store/maintenanceSlice";

export const logout = createAction("auth/logout");

const appReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  maintenance: maintenanceReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (logout.match(action)) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
