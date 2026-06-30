import { createSlice } from "@reduxjs/toolkit";

interface RenderState {
  wakingUp: boolean;
}

const initialState: RenderState = {
  wakingUp: false,
};

const renderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    setRenderWaking(state, action) {
      state.wakingUp = action.payload;
    },
  },
});

export const { setRenderWaking } = renderSlice.actions;
export default renderSlice.reducer;
