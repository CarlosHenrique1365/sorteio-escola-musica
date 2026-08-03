import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import usePrefersReducedMotion from "./hooks/usePrefersReducedMotion";
import Saturno from "./pages/Saturno/Saturno";
import Cadastro from "./pages/Cadastro/Cadastro";
import Login from "./pages/Login/Login";
import Organizador from "./pages/Organizador/Organizador";
import "./styles/global.css";

export default function App() {
  return (
    <usePrefersReducedMotion>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Saturno />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/organizador"
              element={
                <ProtectedRoute>
                  <Organizador />
                </ProtectedRoute>
              }
            />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </usePrefersReducedMotion>
  );
}