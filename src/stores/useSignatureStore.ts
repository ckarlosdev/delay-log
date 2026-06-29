import { create } from "zustand";

interface SignatureStore {
  subcontractorData: string | null;
  contractorData: string | null;
  setSubcontractorData: (data: string | null) => void;
  setContractorData: (data: string | null) => void;
  reset: () => void;
}

export const useSignatureStore = create<SignatureStore>((set) => ({
  subcontractorData: null,
  contractorData: null,
  setSubcontractorData: (data) => set({ subcontractorData: data }),
  setContractorData: (data) => set({ contractorData: data }),
  reset: () => set({ subcontractorData: null, contractorData: null }),
}));