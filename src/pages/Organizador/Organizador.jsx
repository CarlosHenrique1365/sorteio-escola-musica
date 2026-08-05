import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiAward, FiStar, FiPlay } from "react-icons/fi";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import WaveBackground from "../../components/WaveBackground/WaveBackground";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import CounterCard from "../../components/CounterCard/CounterCard";
import Roulette from "../../components/Roulette/Roulette";
import HistoryTable from "../../components/HistoryTable/HistoryTable";
import MusicNotes from "../../components/MusicNotes/MusicNotes";
import { formatParticipantNumber } from "../../utils/format";
import { listarParticipantes, sortear, buscarHistorico } from "../../services/api";
import styles from "./Organizador.module.css";

// Tipografia da marca STUGIORE — alternativas gratuitas (Google Fonts)
// Fraunces      -> substitui Batusa Regular (títulos, destaques, números de vencedor)
// Poppins Light -> substitui Nexa Light (textos correntes, rótulos e botões)
// Importar no index.html: ver instruções no final da conversa
const FONT_HEADING = "'Fraunces', serif";
const FONT_BODY = "'Poppins', sans-serif";

export default function Organizador() {
  const [totalParticipantes, setTotalParticipantes] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [ignorarGanhadores, setIgnorarGanhadores] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [spinKey, setSpinKey] = useState(0);
  const [drawError, setDrawError] = useState("");

  useEffect(() => {
    async function loadData() {
      const [participantesResult, historicoResult] = await Promise.allSettled([
        listarParticipantes(),
        buscarHistorico(),
      ]);

      if (participantesResult.status === "fulfilled") {
        setTotalParticipantes(participantesResult.value.length);
      } else {
        console.error("Falha ao buscar participantes:", participantesResult.reason);
      }

      if (historicoResult.status === "fulfilled") {
        setHistorico(historicoResult.value);
      } else {
        console.error("Falha ao buscar histórico:", historicoResult.reason);
        setHistorico([]);
      }
    }
    loadData();
  }, []);

  const ultimoVencedor = historico[0];

  async function handleSortear() {
    setDrawError("");
    setDrawing(true);
    setWinner(null);
    try {
      // O vencedor já vem definido pela API ANTES da animação começar.
      const resultado = await sortear({ ignorarGanhadores });

      if (!resultado.sucesso) {
        setDrawError(resultado.mensagem || "Não foi possível sortear agora.");
        setDrawing(false);
        return;
      }

      setDrawing(false);
      setSpinning(true);
      setSpinKey((key) => key + 1);
      setWinner(resultado);
    } catch {
      setDrawError("Não foi possível realizar o sorteio agora. Tente novamente.");
      setDrawing(false);
    }
  }

  async function handleSpinEnd() {
    setSpinning(false);
    try {
      const historicoAtualizado = await buscarHistorico();
      setHistorico(historicoAtualizado);
    } catch {
      /* mantém histórico atual em caso de falha silenciosa */
    }
  }

  return (
    <div className={styles.page}>
      <WaveBackground />
      <Header />
      <MusicNotes trigger={winner && !spinning} />

      <main className={styles.main}>
        <section className={styles.statsGrid}>
          <CounterCard icon={FiUsers} value={totalParticipantes} label="Participantes" />
          <CounterCard icon={FiAward} value={historico.length} label="Sorteios realizados" />
          <CounterCard
            icon={FiStar}
            value={ultimoVencedor ? ultimoVencedor.numero : 0}
            label={ultimoVencedor ? `Último vencedor: ${ultimoVencedor.nome}` : "Nenhum vencedor ainda"}
          />
        </section>

        <Card pianoStripes className={styles.drawCard}>
          <h2 className={styles.drawTitle} style={{ fontFamily: FONT_HEADING }}>
            Sortear vencedor
          </h2>

          <label className={styles.checkboxRow} style={{ fontFamily: FONT_BODY }}>
            <input
              type="checkbox"
              checked={ignorarGanhadores}
              onChange={(event) => setIgnorarGanhadores(event.target.checked)}
            />
            Não sortear quem já ganhou
          </label>

          {drawError && (
            <p
              role="alert"
              style={{ color: "var(--color-error)", fontSize: "var(--fs-sm)", fontFamily: FONT_BODY }}
            >
              {drawError}
            </p>
          )}

          <Button onClick={handleSortear} loading={drawing} disabled={spinning}>
            <FiPlay />
            <span style={{ fontFamily: FONT_BODY }}>Sortear vencedor</span>
          </Button>

          {drawError && !winner && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ width: "100%" }}
            >
              <Card className={styles.winnerCard}>
                <span className={styles.trophy} style={{ fontFamily: FONT_HEADING }} aria-hidden="true">
                  🎉 Sorteio encerrado
                </span>
                <span className={styles.winnerName} style={{ fontFamily: FONT_BODY }}>
                  {drawError}
                </span>
              </Card>
            </motion.div>
          )}

          {winner && (
            <Roulette winnerNumber={winner.numero} spinKey={spinKey} onSpinEnd={handleSpinEnd} />
          )}
          <AnimatePresence>
            {winner && !spinning && (
              <motion.div
                key={winner.numero}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: [0.85, 1.1, 1] }}
                transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                style={{ width: "100%" }}
              >
                <Card highlight className={styles.winnerCard}>
                  <span className={styles.trophy} style={{ fontFamily: FONT_HEADING }} aria-hidden="true">
                    🏆 Vencedor
                  </span>
                  <span className={styles.winnerNumber} style={{ fontFamily: FONT_HEADING }}>
                    {formatParticipantNumber(winner.numero)}
                  </span>
                  <span className={styles.winnerName} style={{ fontFamily: FONT_BODY }}>
                    {winner.nome}
                  </span>
                  <span className={styles.winnerPhone} style={{ fontFamily: FONT_BODY }}>
                    {winner.telefone}
                  </span>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle} style={{ fontFamily: FONT_HEADING }}>
            Histórico de sorteios
          </h2>
          <HistoryTable rows={historico} variant="historico" emptyMessage="Nenhum sorteio realizado ainda." />
        </section>
      </main>

      <Footer />
    </div>
  );
}