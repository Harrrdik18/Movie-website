import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import movieReducer from "./slices/movieSlice";
import chatReducer from "./slices/chatSlice";
import renderReducer from "./slices/renderSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
    chat: chatReducer,
    render: renderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
