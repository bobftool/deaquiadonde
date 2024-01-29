import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import Login from "../components/Login";
import Panel from "../components/Panel";

function Admin() {
  const loginContextData = useContext(LoginContext);

  return <>{loginContextData.isLogged ? loginContextData.isLogged === "waiting" ? <></> : <Panel /> : <Login />}</>;
}

export default Admin;
