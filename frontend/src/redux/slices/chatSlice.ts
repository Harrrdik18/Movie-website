import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendChatMessage } from "../../services/chatService";
import type { ChatResponse } from "../../services/chatService";

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async (message: string, { rejectWithValue }) => {
    try {
      return await sendChatMessage(message);
    } catch (error) {
      return rejectWithValue(
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to get response"
      );
    }
  }
);

interface ChatState {
  query: string;
  response: string | null;
  movies: ChatResponse["movies"];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  query: "",
  response: null,
  movies: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChat(state) {
      state.query = "";
      state.response = null;
      state.movies = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state, action) => {
        state.query = action.meta.arg;
        state.loading = true;
        state.error = null;
        state.response = null;
        state.movies = [];
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload.reply;
        state.movies = action.payload.movies;
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
