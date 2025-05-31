import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { firstLoad } from 'state/firstLoadAction';

interface RootState {
  globalSearch: boolean;
  loading: boolean;
}

export const initialState: RootState = {
  globalSearch: false,
  loading: false,
};

// thunk
export const firstLoadThunk = createAsyncThunk(
  'config/first-load',
  async () => {
    try {
      await firstLoad();
      return;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

const rootSlice = createSlice({
  name: 'root',
  initialState: initialState,
  reducers: {
    setGlobalSearch(state, { payload }: PayloadAction<boolean>) {
      state.globalSearch = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(firstLoadThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addMatcher(
      isAnyOf(firstLoadThunk.fulfilled, firstLoadThunk.rejected),
      (state) => {
        state.loading = false;
      }
    );
  },
});

// actions
export const { setGlobalSearch } = rootSlice.actions;

// reducer
export const reducer = rootSlice.reducer;
