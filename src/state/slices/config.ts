import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getImgsConfigApi } from 'utils/api';
import { ImgConfig } from 'models';
export type Language = 'en' | 'es'

interface ConfigState {
  img?: ImgConfig;
  language: Language;
}

const initialState: ConfigState = {
  language: (localStorage.getItem('language') || 'en') as Language,
};

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
  initialState: initialState,
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

// actions
export const { setLanguage } = configSlice.actions;

// reducer
export const reducer = configSlice.reducer;
