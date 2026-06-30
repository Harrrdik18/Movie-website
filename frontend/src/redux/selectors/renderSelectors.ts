import type { RootState } from "../store";

export const selectRenderWakingUp = (state: RootState) => state.render.wakingUp;
