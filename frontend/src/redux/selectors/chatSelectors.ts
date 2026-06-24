import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const selectChatState = (state: RootState) => state.chat;

export const selectChatQuery = createSelector(
  selectChatState,
  (c) => c.query
);

export const selectChatResponse = createSelector(
  selectChatState,
  (c) => c.response
);

export const selectChatMovies = createSelector(
  selectChatState,
  (c) => c.movies
);

export const selectChatLoading = createSelector(
  selectChatState,
  (c) => c.loading
);

export const selectChatError = createSelector(
  selectChatState,
  (c) => c.error
);
