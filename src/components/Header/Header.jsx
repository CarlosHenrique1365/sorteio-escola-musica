import { FiLogOut } from "react-icons/fi";
import Button from "../Button/Button";
import useAuth from "../../hooks/useAuth";
import styles from "./Header.module.css";

import logo from "../../assets/logo.png";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img
          src={logo}
          alt="Logo da Studiore Escola de Música"
          className={styles.logo}
        />

        <div className={styles.brandText}>
          <span className={styles.studiore}>
            STUGIORE
          </span>

          <span className={styles.school}>
            ESCOLA DE MÚSICA
          </span>
        </div>
      </div>

      {isAuthenticated && (
        <div className={styles.actions}>
          <span className={styles.userName}>
            Olá, {user?.nome}
          </span>

          <Button
            variant="ghost"
            onClick={logout}
            ariaLabel="Sair da conta"
          >
            <FiLogOut />
            Sair
          </Button>
        </div>
      )}
    </header>
  );
}
