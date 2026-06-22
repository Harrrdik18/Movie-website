import { createSelector } from "@reduxjs/toolkit";

const selectUserState = (state) => state.user;

export const selectUser = createSelector(selectUserState, (user) => user.user);
export const selectIsAuthenticated = createSelector(
  selectUserState,
  (user) => user.isAuthenticated
);
export const selectUserLoading = createSelector(
  selectUserState,
  (user) => user.loading
);
export const selectUserError = createSelector(
  selectUserState,
  (user) => user.error
);
export const selectUserSuccess = createSelector(
  selectUserState,
  (user) => user.success
);
