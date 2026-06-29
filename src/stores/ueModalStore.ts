import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModalConfiguration } from "../types";

type ModalsStore = {
  showPopupModal: boolean;
  modalConfig: ModalConfiguration;

  setShowPopupModal: (show: boolean) => void;
  setModalConfig: (config: ModalConfiguration) => void;
};

const useModalsStore = create<ModalsStore>()(
  persist(
    (set) => ({
      showPopupModal: false,
      modalConfig: { title: "", body: "", variant: "success" },

      setShowPopupModal: (show) => set({ showPopupModal: show }),
      setModalConfig: (config) => set({ modalConfig: config }),
    }),
    {
      name: "modals-storage",
    },
  ),
);

export default useModalsStore;
