import { Button } from "react-bootstrap";

type Props = {};

function LogoutButton({}: Props) {
  const handleLogout = async () => {
    // setIsLoading(true);
    // try {
    //   // 1. Avisar al servidor para revocar el token en la DB
    //   if (refreshToken) {
    //     await api.post("/auth/revoke", { refreshToken });
    //   }
    // } catch (error) {
    //   console.error(
    //     "Error al revocar token, cerrando sesión localmente...",
    //     error,
    //   );
    // } finally {
    //   logout();
    //   window.location.href = "https://ckarlosdev.github.io/login/";
    // }
  };

  return (
    // <Button
    //   onClick={handleLogout}
    //   //   disabled={isLoading}
    //   variant="outline-danger"
    //   style={{
    //     borderRadius: "10px",
    //     fontWeight: "bold",
    //     width: "120px",
    //     height: "40px",
    //   }}
    // >
    //   Logging out
    //   {/* {isLoading ? <span>Logging out</span> : <>Logout</>} */}
    // </Button>

    <Button
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
    </Button>
  );
}

export default LogoutButton;
