import { configureStore } from '@reduxjs/toolkit';
import userslice from './userSlice';
import projectslice from './projectSlice';
import epicReducer from './epicsSlice';

// ...

export const store = configureStore({
  reducer: {
    User: userslice,
    Project: projectslice,
    epics: epicReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
