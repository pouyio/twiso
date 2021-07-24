import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { initialState, Language } from '../state';
import { getImgsConfigApi } from 'utils/api';

export const loadImgConfig = createAsyncThunk('config/load', async () => {
  try {
    const { data } = await getImgsConfigApi();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

const configSlice = createSlice({
  name: 'config',
  initialState: initialState.config,
  reducers: {
    setLanguage(state, { payload }: PayloadAction<Language>) {
      state.language = payload;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(loadImgConfig.fulfilled, (state, { payload }) => {
      state.img = payload;
    }),
});

export const { setLanguage } = configSlice.actions;

export const reducer = configSlice.reducer;
