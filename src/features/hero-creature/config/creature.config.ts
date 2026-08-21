/** Parámetros de la criatura de píxeles del hero. */

export const CREATURE_CONFIG = {
  /** Entrada estroboscópica */
  strobe: {
    /** Duración de un destello (s). Corto: tiene que leerse como parpadeo. */
    flashDuration: 0.055,
    /** Destellos mínimos y máximos antes de quedarse encendido. */
    minFlashes: 2,
    maxFlashes: 6,
    /** Recorrido de la ola de entrada, de abajo hacia arriba (s). */
    span: 1.1,
    /** Desorden por píxel dentro de la ola (s). */
    jitter: 0.32,
  },

  /** Repulsión magnética al pasar el puntero */
  magnet: {
    /** Radio de influencia, en px de pantalla. */
    radius: 130,
    /** Desplazamiento máximo de un píxel, en px de pantalla. */
    strength: 26,
    /**
     * Constante de tiempo del seguimiento (ms). Alta a propósito: el enunciado
     * pide que se repelan "de manera suave", así que el píxel persigue su
     * objetivo con retardo en vez de saltar.
     */
    tau: 130,
    /** Por debajo de este desplazamiento se deja de escribir en el DOM. */
    epsilon: 0.05,
  },
} as const;
