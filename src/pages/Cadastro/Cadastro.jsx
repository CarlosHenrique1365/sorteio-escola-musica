import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiPhone, FiMusic, FiShare2, FiList } from "react-icons/fi";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import WaveBackground from "../../components/WaveBackground/WaveBackground";
import Equalizer from "../../components/WaveBackground/Equalizer";
import MusicNotes from "../../components/MusicNotes/MusicNotes";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import HistoryTable from "../../components/HistoryTable/HistoryTable";
import useWordReveal from "../../hooks/useWordReveal";
import { formatPhone, formatParticipantNumber } from "../../utils/format";
import { cadastrarParticipante, listarParticipantes } from "../../services/api";
import styles from "./Cadastro.module.css";

const TITLE = "Sua música começa aqui";

export default function Cadastro() {
  const words = useWordReveal(TITLE);
  const [form, setForm] = useState({ nome: "", telefone: "", instrumento: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);
  const [showList, setShowList] = useState(false);
  const [participantes, setParticipantes] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!form.nome.trim()) nextErrors.nome = "Informe seu nome completo.";
    if (form.telefone.replace(/\D/g, "").length < 10) {
      nextErrors.telefone = "Informe um telefone válido com DDD.";
    }
    if (!form.instrumento.trim()) {
      nextErrors.instrumento = "Conte pra gente seu instrumento favorito.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await cadastrarParticipante(form);

      // Contrato real do api.js:
      //  - Sucesso:        { sucesso: true,  cadastrado: false, numero, nome, mensagem }
      //  - Já cadastrado:  { sucesso: false, cadastrado: true,  numero, nome, mensagem }
      // Em ambos os casos exibimos o card de resultado — a única diferença
      // é o texto de destaque, tratado direto no JSX via result.cadastrado.
      // Se o n8n ainda não estiver enviando "numero" no caso de duplicidade,
      // o card mostra "—" no lugar do número (ver formatParticipantNumber).
      setResult(data);
    } catch {
      // Erro de rede real (sem resposta do servidor) — cadastrarParticipante
      // já trata respostas de erro do n8n com corpo JSON, então chegar aqui
      // significa que não houve resposta alguma.
      setSubmitError("Não foi possível concluir seu cadastro agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleList() {
    const next = !showList;
    setShowList(next);
    if (next && participantes.length === 0) {
      setLoadingList(true);
      try {
        const data = await listarParticipantes();
        setParticipantes(data);
      } catch {
        setParticipantes([]);
      } finally {
        setLoadingList(false);
      }
    }
  }

  async function handleShare() {
    const shareData = {
      title: "Escola de Música",
      text: `Acabei de me cadastrar no sorteio da Escola de Música! Meu número é ${formatParticipantNumber(
        result?.numero
      )}.`,
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* usuário cancelou o compartilhamento */
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    }
  }

  return (
    <div className={styles.page}>
      <WaveBackground />
      <Equalizer />
      <Header />
      <MusicNotes trigger={Boolean(result)} />

      <main className={styles.main}>
        <div className={styles.hero}>
          <motion.h1 className={styles.title}>
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className={styles.titleWord}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: words.length * 0.12 + 0.2, duration: 0.6 }}
          >
            Cadastre-se para participar do nosso grande sorteio.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <Card pianoStripes className={styles.formCard}>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <Input
                    label="Nome completo"
                    icon={FiUser}
                    placeholder="Como podemos te chamar?"
                    value={form.nome}
                    onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
                    error={errors.nome}
                    required
                  />
                  <Input
                    label="Telefone"
                    icon={FiPhone}
                    placeholder="(11) 91234-5678"
                    value={form.telefone}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, telefone: formatPhone(event.target.value) }))
                    }
                    error={errors.telefone}
                    required
                  />
                  <Input
                    label="Instrumento favorito"
                    icon={FiMusic}
                    placeholder="Ex: Violão, Piano, Bateria..."
                    value={form.instrumento}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, instrumento: event.target.value }))
                    }
                    error={errors.instrumento}
                    required
                  />
                  {submitError && (
                    <p role="alert" style={{ color: "var(--color-error)", fontSize: "var(--fs-sm)" }}>
                      {submitError}
                    </p>
                  )}
                  <Button type="submit" fullWidth loading={loading}>
                    Quero participar
                  </Button>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
            >
              <Card pianoStripes highlight className={styles.resultCard}>
                <p className={styles.congrats}>
                  {result.cadastrado
                    ? `Você já está cadastrado, ${result.nome?.split(" ")[0] || form.nome.split(" ")[0]}!`
                    : `Parabéns, ${result.nome?.split(" ")[0] || form.nome.split(" ")[0]}!`}
                </p>
                <span className={styles.numberLabel}>
                  {result.cadastrado ? "Seu número da sorte é" : "Seu número é"}
                </span>
                <motion.span
                  className={styles.number}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.4, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 0.7, times: [0, 0.7, 1], ease: "easeOut" }}
                >
                  {formatParticipantNumber(result.numero)}
                </motion.span>
                <div className={styles.resultActions}>
                  <Button variant="secondary" onClick={handleShare}>
                    <FiShare2 />
                    Compartilhar
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <section className={styles.statsSection}>
          <p>
            <strong style={{ color: "var(--color-gold)" }}>
              {(result?.totalParticipantes ?? "—").toLocaleString?.("pt-BR") ?? result?.totalParticipantes}
            </strong>{" "}
            participantes cadastrados
          </p>
          <Button variant="ghost" onClick={handleToggleList}>
            <FiList />
            {showList ? "Ocultar lista" : "Ver lista completa"}
          </Button>
        </section>

        <AnimatePresence>
          {showList && (
            <motion.section
              className={styles.tableSection}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
            >
              <HistoryTable
                rows={participantes}
                variant="participantes"
                emptyMessage={loadingList ? "Carregando participantes..." : "Nenhum participante ainda."}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
