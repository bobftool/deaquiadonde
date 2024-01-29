import { useState, useEffect } from "react";

function Login() {
  //const loginContextData = useContext(LoginContext);

  const [captcha, setCaptcha] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    serveLogin();
  }, []);

  const serveLogin = async () => {
    const response = await fetch(process.env.REACT_APP_API + "/login", {
      credentials: "include",
    });
    const data = await response.json();

    setCaptcha(data);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      username: event.target.username.value,
      password: event.target.password.value,
      captcha: {
        id: captcha.id,
        solution: event.target.captcha.value,
      },
    };

    const response = await fetch(process.env.REACT_APP_API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    });
    const data = await response.json();
    
    //if(data.logged) loginContextData.setIsLogged(true);
    //else setMessage(data.message);
    if(data.message) setMessage(data.message);
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <input type="text" name="username" placeholder="Usuario" />
        <input type="password" name="password" placeholder="Contraseña" />
        {captcha ? (
          <>
            <img
              src={"data:image/png;base64," + captcha.imageBase64}
              alt="captcha"
            />
            <input type="text" name="captcha" placeholder="Captcha" />
            <button type="submit">Enviar</button>
            {message?? <p>{message}</p>}
          </>
        ) : (
          <>
            <p>Cargando...</p>
            <button disabled>Enviar</button>
          </>
        )}
      </form>
    </>
  );
}

export default Login;
