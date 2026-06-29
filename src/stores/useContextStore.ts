import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppContextState {
  jobId: number | null;
  delayLogId: number | null;
  isLoaded: boolean;
  setIds: (jobId: number | null, changeOrderId: number | null) => void;
  setIsLoaded: (loaded: boolean) => void;
}

export const useContextStore = create<AppContextState>()(
  persist(
    (set) => ({
      jobId: null,
      delayLogId: null,
      isLoaded: false,
      setIds: (jobId, delayLogId) =>
        set(() => ({ jobId, delayLogId: delayLogId })),
      setIsLoaded: (loaded) => set(() => ({ isLoaded: loaded })),
    }),
    {
      name: "app-context-store",
    },
  ),
);
