import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import movieReducer from "./slices/movieSlice";
import chatReducer from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
