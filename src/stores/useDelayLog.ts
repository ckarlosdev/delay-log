import { persist } from "zustand/middleware";
import type { DelayLog } from "../types";
import { create } from "zustand";

type DelayLogStore = {
  delayLogData: DelayLog;
  setDelayLogData: <K extends keyof DelayLog>(
    key: K,
    value: DelayLog[K],
  ) => void;
  reset: () => void;
  setFullData: (data: DelayLog) => void;
};

const getTodayDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset)
    .toISOString()
    .split("T")[0];
  return localISOTime;
};

const initialData = {
  id: null,
  jobId: null,
  employeeId: null,
  delayDate: getTodayDate(),
  location: "",
  delayDescription: "",
  impactEquipment: "",
  summary: "",
  resolution: "",
  workers: "",
  cost: "",
  delayStatus: "DRAFT",
  times: [],
  options: [],
  signatures: [],
};

const useDelayLogStore = create(
  persist<DelayLogStore>(
    (set) => ({
      delayLogData: initialData,
      setDelayLogData: (key, value) =>
        set((state) => ({
          delayLogData: {
            ...state.delayLogData,
            [key]: value,
          },
        })),
      reset: () => set({ delayLogData: initialData }),
      setFullData: (data) =>
        set(() => ({
          delayLogData: data,
        })),
    }),
    {
      name: "delayLog-storage",
    },
  ),
);

export default useDelayLogStore;
