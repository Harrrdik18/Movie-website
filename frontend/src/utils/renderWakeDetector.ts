import axios from "axios";
import type { AppStore } from "../redux/store";
import { setRenderWaking } from "../redux/slices/renderSlice";

export function initRenderWakeDetector(store: AppStore) {
  if (import.meta.env.DEV) return;

  let activeRequests = 0;
  let wakeTimer: ReturnType<typeof setTimeout> | null = null;
  const WAKE_THRESHOLD_MS = 8000;

  const clearWakeTimer = () => {
    if (wakeTimer !== null) {
      clearTimeout(wakeTimer);
      wakeTimer = null;
    }
  };

  axios.interceptors.request.use((config) => {
    activeRequests++;
    if (activeRequests === 1) {
      wakeTimer = setTimeout(() => {
        store.dispatch(setRenderWaking(true));
      }, WAKE_THRESHOLD_MS);
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        clearWakeTimer();
        store.dispatch(setRenderWaking(false));
      }
      return response;
    },
    (error) => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        clearWakeTimer();
        store.dispatch(setRenderWaking(false));
      }
      return Promise.reject(error);
    }
  );
}
