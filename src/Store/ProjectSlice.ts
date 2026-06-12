import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getBaseUrl from '../utils/api';
import { apiClient } from '../utils/apiClient';

type Member = {
  id: string;
  project_id: string;
  user_id: string;
  role?: string;
};

type StateProps = {
  loading: boolean;
  error: string | null;
  members: Member[];
};

const initialState: StateProps = {
  loading: false,
  error: null,
  members: [],
};

export const getProjectMembers = createAsyncThunk(
  'projects/getProjectMembers',
  async (data: { projectId: string }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await apiClient(
        getBaseUrl(
          `rest/v1/get_project_members?project_id=eq.${data.projectId}`,
        ),
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result?.message || result?.error || 'Failed to get project members',
        );
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  },
);

const projectMembersSlice = createSlice({
  name: 'projectMembers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(getProjectMembers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || 'Failed to get project members';
      });
  },
});

export default projectMembersSlice.reducer;
