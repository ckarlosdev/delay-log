import type { ReactNode } from "react";
import hmbLogo from "../assets/hmbLogo.png";
import { Button } from "react-bootstrap";
import LogoutButton from "./LogoutButton";
import { useAuthStore } from "../stores/useAuthStore";
import { useContextStore } from "../stores/useContextStore";
import useUser from "../hooks/useUser";
import useDelayLogStore from "../stores/useDelayLog";
import { useSignatureStore } from "../stores/useSignatureStore";

type Props = { children: ReactNode };

function Title({ children }: Props) {
  const { isLoading } = useUser();
  const { user: userAuth } = useAuthStore();
  const jobId = useContextStore((s) => s.jobId);

  const { reset: resetDelayLog } = useDelayLogStore();
  const { reset: resetSignatures } = useSignatureStore();

  const handleReset = () => {
    resetDelayLog();
    resetSignatures();
  };

  return (
    <div className="w-100 mt-4 mb-3 text-center px-3">
      {/* 1. CONTENEDOR DEL LOGO (Limpio y centrado) */}
      <div className="mb-3">
        <img
          src={hmbLogo}
          alt="Company Logo"
          style={{ width: "180px", height: "auto", objectFit: "contain" }}
        />
      </div>

      {/* 2. BARRA DE NAVEGACIÓN Y TÍTULO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr", // Distribución perfecta de espacio compartido
          alignItems: "center",
          gap: "15px",
        }}
      >
        {/* COLUMNA IZQUIERDA: Botón Home (Alineado estrictamente a la izquierda) */}
        <div className="d-flex justify-content-start align-items-center">
          <Button
            variant="outline-secondary"
            className="no-print d-flex align-items-center justify-content-center gap-1"
            style={{
              borderRadius: "8px",
              fontWeight: "600",
              width: "110px",
              height: "38px",
              fontSize: "14px",
            }}
            onClick={() => {
              handleReset();
              window.location.href = `https://ckarlosdev.github.io/binder-webapp/#/binder/${jobId}`;
            }}
          >
            ‹ Binder
          </Button>
        </div>

        {/* COLUMNA CENTRAL: Título Dinámico */}
        <div>
          <h2
            className="text-dark m-0 fw-bold"
            style={{
              fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
              lineHeight: "1.2",
            }}
          >
            {children}
          </h2>
        </div>

        {/* COLUMNA DERECHA: Info de Usuario + Logout (Alineado estrictamente a la derecha) */}
        <div className="d-flex justify-content-end align-items-center gap-3 no-print">
          {/* Bloque del Nombre de Usuario */}
          <div
            className="d-none d-sm-block text-end pe-3"
            style={{
              fontSize: "13px",
              borderRight: "1px solid #dee2e6",
              lineHeight: "1.4",
            }}
          >
            <span
              className="text-muted d-block"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              User
            </span>
            <span className="fw-semibold text-dark">
              {userAuth?.fullName || "Guest"}
            </span>
          </div>

          {/* Botón de Logout */}
          <LogoutButton />
          {/* <Button
            variant="outline-danger"
            style={{
              borderRadius: "8px",
              fontWeight: "600",
              width: "110px",
              height: "38px",
              fontSize: "14px",
            }}
          >
            Logout
          </Button> */}
        </div>
      </div>
    </div>
  );
}

export default Title;
