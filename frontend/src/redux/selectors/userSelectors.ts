import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const selectUserState = (state: RootState) => state.user;

export const selectUser = createSelector(selectUserState, (u) => u.user);

export const selectIsAuthenticated = createSelector(
  selectUserState,
  (u) => u.isAuthenticated
);

export const selectUserLoading = createSelector(
  selectUserState,
  (u) => u.loading
);

export const selectUserError = createSelector(selectUserState, (u) => u.error);

export const selectUserSuccess = createSelector(
  selectUserState,
  (u) => u.success
);
