import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RootState {
  globalSearch: boolean;
}

export const initialState: RootState = {
  globalSearch: false,
};

const rootSlice = createSlice({
  name: 'root',
  initialState: initialState,
  reducers: {
    setGlobalSearch(state, { payload }: PayloadAction<boolean>) {
      state.globalSearch = payload;
    },
  },
});

// actions
export const { setGlobalSearch } = rootSlice.actions;

// reducer
export const reducer = rootSlice.reducer;
