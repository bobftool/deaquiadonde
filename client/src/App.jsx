import { Routes, Route } from "react-router-dom";
import "./stylesheets/App.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import { LoginContextProvider } from "./contexts/LoginContext";
//import Home from "./pages/Home";
import Horarios from "./pages/Horarios";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <LoginContextProvider>
    <>
      <Header subtitle="hago mi horario" />
      <main className="container">
        <Routes>
          <Route path="/" element={<Horarios />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
    </LoginContextProvider>
  );
}

export default App;
