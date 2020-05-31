import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../state';
import { ImgConfig } from 'models';

const defaultSlice = createSlice({
  name: 'config',
  initialState: initialState.config ?? null,
  reducers: {
    setImagesConfig(state, { payload }: PayloadAction<ImgConfig>) {
      return payload;
    },
  },
});

export const { setImagesConfig } = defaultSlice.actions;

export const reducer = defaultSlice.reducer;
