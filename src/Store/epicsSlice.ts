import { createAsyncThunk } from '@reduxjs/toolkit';
import getBaseUrl from '../utils/api';
import { apiClient } from '../utils/apiClient';
import type { EpicDetailsProps } from '../types/epics';

export const fetchEpicDetails = createAsyncThunk(
  'epics/fetchEpicDetails',
  async (
    { epicId, projectId }: { epicId: string; projectId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient(
        getBaseUrl(
          `rest/v1/project_epics?project_id:eq.${projectId}&id=eq.${epicId}`,
        ),
      );

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to get Epic');
    }
  },
);

// epicSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface EpicState {
  data: EpicDetailsProps[];
  loading: boolean;
  error: string | null;
}

const initialState: EpicState = {
  data: [],
  loading: false,
  error: null,
};

const epicSlice = createSlice({
  name: 'epics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpicDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpicDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEpicDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Something went wrong';
      });
  },
});

export default epicSlice.reducer;
