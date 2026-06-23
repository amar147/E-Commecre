import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { MAINTENANCE_FAILURE_THRESHOLD } from "@/config/maintenance";

type MaintenanceState = {
  consecutiveApiFailures: number;
  isApiDown: boolean;
  isHealthcheckDown: boolean;
  lastErrorType: string | null;
};

const initialState: MaintenanceState = {
  consecutiveApiFailures: 0,
  isApiDown: false,
  isHealthcheckDown: false,
  lastErrorType: null,
};

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    reportApiFailure: (state, action: PayloadAction<string>) => {
      state.consecutiveApiFailures += 1;
      state.lastErrorType = action.payload;

      if (state.consecutiveApiFailures >= MAINTENANCE_FAILURE_THRESHOLD) {
        state.isApiDown = true;
      }
    },
    reportApiSuccess: (state) => {
      state.consecutiveApiFailures = 0;
      state.isApiDown = false;
      state.lastErrorType = null;
    },
    setHealthcheckDown: (state, action: PayloadAction<boolean>) => {
      state.isHealthcheckDown = action.payload;
    },
  },
});

export const { reportApiFailure, reportApiSuccess, setHealthcheckDown } =
  maintenanceSlice.actions;

export default maintenanceSlice.reducer;
