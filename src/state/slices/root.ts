import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RootState {
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

export const initialState: RootState = {
  serviceWorkerRegistration: null,
};

const rootSlice = createSlice({
  name: 'root',
  initialState: initialState,
  reducers: {
    setSWRegistration(
      state,
      { payload }: PayloadAction<ServiceWorkerRegistration | null>
    ) {
      state.serviceWorkerRegistration = payload;
    },
  },
});

// actions
export const { setSWRegistration } = rootSlice.actions;

// reducer
export const reducer = rootSlice.reducer;
