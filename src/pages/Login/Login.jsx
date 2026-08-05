import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

import Header from "../../components/Header/Header";
import WaveBackground from "../../components/WaveBackground/WaveBackground";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import useAuth from "../../hooks/useAuth";

import styles from "./Login.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const resultado = await login(form);

      if (resultado?.sucesso === true) {
        navigate("/organizador");
        return;
      }

      setError(
        resultado?.mensagem ||
          "E-mail ou senha inválidos."
      );
    } catch (error) {
      setError(
        error.message ||
          "Não foi possível realizar o login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <WaveBackground />

      <Header />

      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card pianoStripes className={styles.card}>
            <h1 className={styles.title}>
              Acesso do organizador
            </h1>

            <p className={styles.subtitle}>
              Entre para acompanhar cadastros e realizar o sorteio.
            </p>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <Input
                label="E-mail"
                icon={FiMail}
                type="email"
                placeholder="voce@escoladamusica.com"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                required
              />

              <Input
                label="Senha"
                icon={FiLock}
                type="password"
                placeholder="••••••••"
                value={form.senha}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    senha: event.target.value,
                  }))
                }
                required
              />

              {error && (
                <p
                  role="alert"
                  className={styles.error}
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                loading={loading}
              >
                <span className={styles.buttonText}>
                  Entrar
                </span>
              </Button>
            </form>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}