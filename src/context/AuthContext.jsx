import { createContext, useEffect, useState, useCallback } from "react";
import * as authService from "../services/api";

const TOKEN_KEY = "@escola-musica:token";
const USER_KEY = "@escola-musica:user";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaura a sessão salva ao carregar a aplicação.
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);

    console.log("Resposta do login:", data);

    // O login só é considerado válido se o n8n
    // retornar explicitamente sucesso: true.
    if (data?.sucesso !== true) {
      throw new Error(
        data?.mensagem || "E-mail ou senha inválidos."
      );
    }

    // Só salva a sessão depois que o login foi aprovado.
    const usuario = data.usuario || {
      nome: data.nome,
      email: data.email,
    };

    const token = data.token || "authenticated";

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));

    setUser(usuario);

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
