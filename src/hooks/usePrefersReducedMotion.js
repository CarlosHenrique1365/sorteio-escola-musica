import { useEffect, useState } from "react";

/**
 * Retorna true quando o usuário ativou "reduzir movimento" no sistema.
 * Usado para desabilitar animações pesadas (roleta, chuva de notas, etc).
 */
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event) => setReduced(event.matches);

    // Navegadores modernos
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }

    // Fallback para Safari antigo / WebViews (Instagram, Facebook, Android antigo)
    if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  return reduced;
}