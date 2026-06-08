import { configureStore } from '@reduxjs/toolkit';
import userslice from './UserSlice';
// ...

export const store = configureStore({
  reducer: {
    User: userslice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
