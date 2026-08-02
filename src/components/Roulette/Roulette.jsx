import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import { formatParticipantNumber } from "../../utils/format";
import styles from "./Roulette.module.css";

const SLOT_WIDTH = 120;
const SPIN_DURATION = 2.5; // segundos, conforme especificação

/**
 * Roleta horizontal apenas ilustrativa.
 * O vencedor (`winnerNumber`) já deve ter sido recebido da API ANTES da
 * animação começar — este componente nunca decide o resultado, apenas o exibe.
 *
 * Se `winnerNumber` ainda não chegou (undefined/null), a roleta gira sem
 * assentar em nada, em vez de quebrar o render.
 */
export default function Roulette({ winnerNumber, spinKey, onSpinEnd }) {
  const reducedMotion = usePrefersReducedMotion();
  const [hasSettled, setHasSettled] = useState(false);

  const hasWinner = winnerNumber !== undefined && winnerNumber !== null;

  // Gera uma fita de números aleatórios terminando no vencedor real
  // (ou só girando aleatoriamente, se o vencedor ainda não chegou).
  const reel = useMemo(() => {
    const randomSlots = Array.from({ length: 34 }, () =>
      formatParticipantNumber(Math.floor(Math.random() * 999999))
    );

    if (!hasWinner) {
      return randomSlots;
    }

    return [...randomSlots, formatParticipantNumber(winnerNumber)];
  }, [winnerNumber, hasWinner]);

  const winnerIndex = hasWinner ? reel.length - 1 : null;
  const targetOffset = hasWinner
    ? -(winnerIndex * SLOT_WIDTH + SLOT_WIDTH / 2)
    : 0;

  useEffect(() => {
    setHasSettled(false);
  }, [spinKey]);

  return (
    <div className={styles.frame}>
      <div className={styles.mask}>
        <motion.div
          className={styles.track}
          initial={{ x: 0 }}
          animate={{ x: targetOffset }}
          transition={
            reducedMotion || !hasWinner
              ? { duration: 0 }
              : { duration: SPIN_DURATION, ease: [0.1, 0.7, 0.15, 1] }
          }
          onAnimationComplete={() => {
            if (!hasWinner) return;
            setHasSettled(true);
            onSpinEnd?.();
          }}
        >
          {reel.map((number, index) => (
            <span
              key={`${number}-${index}`}
              className={`${styles.slot} ${
                hasWinner && index === winnerIndex && hasSettled
                  ? styles.slotWinner
                  : ""
              }`}
            >
              {number}
            </span>
          ))}
        </motion.div>
        <span className={styles.marker} aria-hidden="true" />
      </div>
    </div>
  );
}