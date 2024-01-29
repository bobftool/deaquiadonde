import { useState, useEffect, createContext } from "react";

export const LoginContext = createContext();

export function LoginContextProvider(props) {
  const [isLogged, setIsLogged] = useState("waiting");

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const response = await fetch(process.env.REACT_APP_API + "/login/check", {
      credentials: "include",
    });
    const data = await response.json();

    setIsLogged(data.isLogged);
  };

  const data = {
    isLogged,
    setIsLogged,
  };

  return (
    <LoginContext.Provider value={data}>{props.children}</LoginContext.Provider>
  );
}
