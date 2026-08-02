import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import { formatParticipantNumber } from "../../utils/format";
import styles from "./Roulette.module.css";

const SLOT_WIDTH = 120;
const TOTAL_SLOTS = 20;
const SPIN_DURATION = 2.5;

export default function Roulette({
  winnerNumber,
  spinKey,
  onSpinEnd,
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [hasSettled, setHasSettled] = useState(false);

  const hasWinner =
    winnerNumber !== undefined &&
    winnerNumber !== null &&
    winnerNumber !== "";

  // Cria os números que serão exibidos na roleta.
  // O vencedor é colocado sempre no final.
  const reel = useMemo(() => {
    const numbers = Array.from(
      { length: TOTAL_SLOTS },
      () =>
        formatParticipantNumber(
          Math.floor(Math.random() * 999999)
        )
    );

    if (hasWinner) {
      numbers.push(
        formatParticipantNumber(winnerNumber)
      );
    }

    return numbers;
  }, [winnerNumber, hasWinner, spinKey]);

  // O vencedor fica sempre no último slot.
  const winnerIndex = hasWinner
    ? reel.length - 1
    : null;

  // Calcula quanto a fita precisa se mover.
const targetOffset = hasWinner
  ? -(winnerIndex * SLOT_WIDTH) + SLOT_WIDTH / 2
  : 0;

  // Reinicia o estado visual sempre que começa um novo sorteio.
  useEffect(() => {
    setHasSettled(false);
  }, [spinKey]);

  function handleAnimationComplete() {
    if (!hasWinner) {
      return;
    }

    setHasSettled(true);

    if (onSpinEnd) {
      onSpinEnd();
    }
  }

  return (
    <div className={styles.frame}>
      <div className={styles.mask}>
        <motion.div
          className={styles.track}
          initial={{ x: 0 }}
          animate={{
            x: targetOffset,
          }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: SPIN_DURATION,
                  ease: [0.1, 0.7, 0.15, 1],
                }
          }
          onAnimationComplete={handleAnimationComplete}
        >
          {reel.map((number, index) => (
            <span
              key={`${number}-${index}`}
              className={`${styles.slot} ${
                hasWinner &&
                index === winnerIndex &&
                hasSettled
                  ? styles.slotWinner
                  : ""
              }`}
            >
              {number}
            </span>
          ))}
        </motion.div>

        <span
          className={styles.marker}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}