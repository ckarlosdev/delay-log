import { useState } from "react";
import { Button } from "react-bootstrap";
import { useAuthStore } from "../stores/useAuthStore";
import useDelayLogStore from "../stores/useDelayLog";
import { useSignatureStore } from "../stores/useSignatureStore";
import { api } from "../hooks/apiConfig";
import "../styles/buttons.css";

type Props = {};

function LogoutButton({}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const logout = useAuthStore((state) => state.logout);

  const { reset: resetDelay } = useDelayLogStore();
  const { reset: resetSignatures } = useSignatureStore();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // 1. Avisar al servidor para revocar el token en la DB
      if (refreshToken) {
        await api.post("/auth/revoke", { refreshToken });
      }
    } catch (error) {
      console.error(
        "Error al revocar token, cerrando sesión localmente...",
        error,
      );
    } finally {
      handleReset();
      logout();
      window.location.href = "https://ckarlosdev.github.io/login/";
    }
  };

  const handleReset = () => {
    resetDelay();
    resetSignatures();
  };

  return (
    <Button
      className="no-print"
      variant="outline-danger"
      onClick={handleLogout}
      disabled={isLoading}
      style={{
        borderRadius: "8px",
        fontWeight: "600",
        width: "110px",
        height: "38px",
        fontSize: "14px",
      }}
    >
      {isLoading ? <span>Logging out</span> : <>Logout</>}
    </Button>
  );
}

export default LogoutButton;
