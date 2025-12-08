import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getImgsConfigApi } from '../../utils/api';
import { ImgConfig } from '../../models/ImgConfig';
import { Language } from '../../models/Translation';

interface ConfigState {
  img?: ImgConfig;
  language: Language;
}

const initialState: ConfigState = {
  language: (localStorage.getItem('language') || 'es') as Language,
};

// thunks
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
    changeLanguage(state, { payload }: PayloadAction<{ language: Language }>) {
      localStorage.setItem('language', payload.language);
      state.language = payload.language;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadImgConfig.fulfilled, (state, { payload }) => {
      state.img = payload;
    });
  },
});

// actions
export const { changeLanguage } = configSlice.actions;

// reducer
export const reducer = configSlice.reducer;
