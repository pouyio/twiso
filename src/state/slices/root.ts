import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RootState {
  globalSearch: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

export const initialState: RootState = {
  globalSearch: false,
  serviceWorkerRegistration: null,
};

const rootSlice = createSlice({
  name: 'root',
  initialState: initialState,
  reducers: {
    setGlobalSearch(state, { payload }: PayloadAction<boolean>) {
      state.globalSearch = payload;
    },
    setSWRegistration(
      state,
      { payload }: PayloadAction<ServiceWorkerRegistration | null>
    ) {
      state.serviceWorkerRegistration = payload;
    },
  },
});

// actions
export const { setGlobalSearch, setSWRegistration } = rootSlice.actions;

// reducer
export const reducer = rootSlice.reducer;
