import { create } from "zustand";
import type { Signature } from "../types";

interface SignatureStore {
  subcontractorData: string | null;
  subcontractorName: string;
  contractorData: string | null;
  contractorName: string;
  setSubcontractorData: (data: string | null) => void;
  setContractorData: (data: string | null) => void;
  setSubcontractorName: (data: string) => void;
  setContractorName: (data: string) => void;
  subcontractorSavedSignature: Signature | null, 
  contractorSavedSignature: Signature | null,
  syncSavedSignatures: (signaturesArray: Signature[]) => void;
  reset: () => void;
}

export const useSignatureStore = create<SignatureStore>((set) => ({
  subcontractorData: null,
  subcontractorName: "",
  contractorData: null,
  contractorName: "",
  setSubcontractorData: (data) => set({ subcontractorData: data }),
  setContractorData: (data) => set({ contractorData: data }),
  setSubcontractorName: (data) => set({ subcontractorName: data }),
  setContractorName: (data) => set({ contractorName: data }),
  subcontractorSavedSignature: null, 
  contractorSavedSignature: null,

  syncSavedSignatures: (signaturesArray) => {
    // Buscamos si el backend nos devolvió firmas guardadas
    const subSig = signaturesArray?.find(
      (s) => s.signatureRole === "SUBCONTRACTOR",
    );
    const contSig = signaturesArray?.find(
      (s) => s.signatureRole === "CONTRACTOR",
    );

    set({
      // Guardamos la información oficial del servidor (incluye filePath)
      subcontractorSavedSignature: subSig || null,
      contractorSavedSignature: contSig || null,

      // CRÍTICO: Limpiamos los Base64 temporales para que el componente
      // entienda que ahora debe leer la firma guardada y no re-mostrar el Canvas activo
      subcontractorData: null,
      contractorData: null,

      // Mantenemos o inicializamos los nombres si vienen de la API
      subcontractorName: subSig?.signedBy || "",
      contractorName: contSig?.signedBy || "",
    });
  },

  reset: () =>
    set({
      subcontractorData: null,
      contractorData: null,
      contractorName: "",
      subcontractorName: "",
    }),
}));
