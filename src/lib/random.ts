/**
 * PRNG determinista (mulberry32).
 *
 * Las transiciones necesitan aleatoriedad *reproducible*: con `Math.random()` el
 * servidor y el cliente generan valores distintos y React reporta desajuste de
 * hidratación. Con semilla, la misma malla se ve igual en ambos lados.
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Elige un elemento según pesos relativos (no hace falta que sumen 1). */
export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: number,
): T {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let threshold = random * total;
  for (let i = 0; i < items.length; i += 1) {
    threshold -= weights[i];
    if (threshold <= 0) return items[i];
  }
  return items[items.length - 1];
}

