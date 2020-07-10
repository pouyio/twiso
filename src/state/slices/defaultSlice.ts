import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from '../state';
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

const defaultSlice = createSlice({
  name: 'config',
  initialState: initialState.config ?? null,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(loadImgConfig.fulfilled, (state, { payload }) => payload),
});

export const reducer = defaultSlice.reducer;
