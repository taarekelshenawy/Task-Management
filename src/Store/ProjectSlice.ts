import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getBaseUrl from '../utils/api';
import { apiClient } from '../utils/apiClient';

type Member = {
  id: string;
  project_id: string;
  user_id: string;
  role?: string;
  email:string,
  member_id:string,
  metadata:{name:string}
  
};

type StateProps = {
  loading: boolean;
  error: string | null;
 isFetched:boolean,
  members: Member[];
};

const initialState: StateProps = {
  loading: false,
  error: null,
  members:[],
  isFetched:false,
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
        state.isFetched=false;
      })
      .addCase(getProjectMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
        state.isFetched=true;
      })
      .addCase(getProjectMembers.rejected, (state, action) => {
        state.loading = false;
        state.isFetched=false;
        state.error =
          (action.payload as string) || 'Failed to get project members';
      });
  },
});

export default projectMembersSlice.reducer;
