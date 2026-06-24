import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getBaseUrl from '../utils/api';
import { apiClient } from '../utils/apiClient';
import type { EpicDetailsProps } from '../types/epics';
import type { EpicProps } from '../types/epics';

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

// export const getProjectEpics = createAsyncThunk(
//   'epics/getProjectEpics',
//   async (
//     {
//       projectId,
//       limit,
//       offset,
//     }: { projectId: string; limit: number; offset: number },
//     { rejectWithValue },
//   ) => {
//     try {
//       const response = await apiClient(
//         getBaseUrl(
//           `rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}&order=created_at.asc`,
//         ),
//         {
//           headers: {
//             Prefer: 'count=exact',
//           },
//         },
//       );

//       const data = await response.json();
//       const contentRange = response.headers.get('Content-Range');

//       return {
//         data,
//         contentRange,
//       };
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('Failed to get Epics');
//     }
//   },
// );
export const getProjectEpics = createAsyncThunk(
  'epics/getProjectEpics',
  async (
    {
      projectId,
      limit,
      offset,
      searchValue,
    }: {
      projectId: string;
      limit: number;
      offset: number;
      searchValue?: string;
    },
    { rejectWithValue },
  ) => {
    console.log({
      searchValue,
      offset,
    });
    try {
      let url = `rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}&order=created_at.asc`;

      if (searchValue?.trim()) {
        url += `&title=ilike.%25${encodeURIComponent(searchValue)}%25`;
      }
      const response = await apiClient(getBaseUrl(url), {
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'count=exact',
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      const contentRange = response.headers.get('Content-Range');

      return {
        data,
        contentRange,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue('Failed to get Epics');
    }
  },
);
interface EpicState {
  data: EpicDetailsProps[];
  ProjectEpics: EpicProps[];
  contentRange: string | null;
  loading: boolean;
  loadingProjectEpics: boolean;
  error: string | null;
}

const initialState: EpicState = {
  data: [],
  ProjectEpics: [],
  contentRange: '',
  loading: false,
  loadingProjectEpics: false,
  error: null,
};

const epicSlice = createSlice({
  name: 'epics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ================= FETCH EPIC DETAILS =================
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
      })

      // ================= GET PROJECT EPICS =================
      .addCase(getProjectEpics.pending, (state) => {
        state.loadingProjectEpics = true;
        state.error = null;
      })
      .addCase(getProjectEpics.fulfilled, (state, action) => {
        state.loadingProjectEpics = false;

        // خيار 1: replace
        state.ProjectEpics = action.payload.data;
        state.contentRange = action.payload.contentRange;

        // خيار 2 (لو pagination infinite scroll):
        // state.projectEpics = [...state.projectEpics, ...action.payload];
      })
      .addCase(getProjectEpics.rejected, (state, action) => {
        state.loadingProjectEpics = false;
        state.error = (action.payload as string) || 'Something went wrong';
      });
  },
});

export default epicSlice.reducer;

// import { createAsyncThunk } from '@reduxjs/toolkit';
// import getBaseUrl from '../utils/api';
// import { apiClient } from '../utils/apiClient';
// import type { EpicDetailsProps } from '../types/epics';
// import { createSlice } from '@reduxjs/toolkit';

// export const fetchEpicDetails = createAsyncThunk(
//   'epics/fetchEpicDetails',
//   async (
//     { epicId, projectId }: { epicId: string; projectId: string },
//     { rejectWithValue },
//   ) => {
//     try {
//       const response = await apiClient(
//         getBaseUrl(
//           `rest/v1/project_epics?project_id:eq.${projectId}&id=eq.${epicId}`,
//         ),
//       );

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('Failed to get Epic');
//     }
//   },
// );

// export const getProjectEpics = createAsyncThunk(
//   'epics/getProjectEpics',
//   async (
//     {  projectId,limit,offset}: { limit:number, projectId: string ,offset:number},
//     { rejectWithValue },
//   ) => {
//     try {
//       const response = await apiClient(
//         getBaseUrl(
//       `rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
//         ),
//          {
//         headers: {
//           Prefer: 'count=exact',
//         },
//       },
//       );

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('Failed to get Epic');
//     }
//   },
// );

// interface EpicState {
//   data: EpicDetailsProps[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: EpicState = {
//   data: [],
//   loading: false,
//   error: null,
// };

// const epicSlice = createSlice({
//   name: 'epics',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchEpicDetails.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchEpicDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchEpicDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = (action.payload as string) || 'Something went wrong';
//       });
//   },
// });

// export default epicSlice.reducer;
