import React from "react";
import type { Signature } from "../types";

type Props = {
  signature?: Signature;
};

function SignatureViewer({ signature }: Props) {
  // 1. Apunta directamente a tu API Gateway de Render (que ya tiene HTTPS)
  const BACKEND_BASE_URL = "https://api-gateway-px44.onrender.com";

  // 2. Unimos la URL base de Render con el path que viene en el JSON
  const finalPath = signature?.filePath
    ? signature.filePath.startsWith("http")
      ? signature.filePath
      : `${BACKEND_BASE_URL}${signature.filePath.startsWith("/") ? "" : "/"}${signature.filePath}`
    : "";

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const imgTarget = e.target as HTMLImageElement;
    imgTarget.onerror = null; // Evita bucles infinitos
    imgTarget.src = "https://placehold.co/250x100?text=Error+loading+signature";
  };

  return (
    <div
      className="border rounded p-3 bg-light text-center"
      style={{ minWidth: "280px", minHeight: "160px" }}
    >
      {signature?.filePath ? (
        <>
          {/* Contenedor de la Imagen */}
          <div className="flex-grow-1 d-flex align-items-center justify-content-center mb-2">
            <img
              src={finalPath}
              alt={`Firma de ${signature?.signatureRole}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100px", // Bajamos ligeramente a 100px para que no empuje al texto
                objectFit: "contain",
                backgroundColor: "#f8f9fa", // Fondo claro por si firmaron en transparente
              }}
              onError={handleImageError}
            />
          </div>

          {/* ACLARACIÓN DE LA FIRMA (signedBy) */}
          {signature?.signedBy && (
            <div className="border-top pt-2">
              <span
                className="d-block fw-bold text-dark mb-0"
                style={{ fontSize: "14px" }}
              >
                {signature.signedBy}
              </span>
            </div>
          )}
        </>
      ) : (
        <p className="text-danger mt-4">⚠️ No Signature</p>
      )}
    </div>
  );
}

export default SignatureViewer;
