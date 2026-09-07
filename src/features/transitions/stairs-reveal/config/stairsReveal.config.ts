/** Configuración de la transición de escaleras. */

export const STAIRS_REVEAL_CONFIG = {
  /** Columnas en pantalla. Diez es lo que deja el escalón legible a 1280px. */
  columns: 10,
  /** En móvil menos columnas: a 10 quedan tiras de 38px y el escalón no se lee. */
  mobileColumns: 6,
  /** Punto de corte para el recuento reducido. */
  mobileBreakpoint: 640,

  /** Duración del recorrido de una columna (s). */
  panelDuration: 0.5,
  /** Desfase entre columnas (s). Es lo que dibuja la escalera. */
  columnStagger: 0.05,
  /** Pausa con la pantalla cubierta, para cambiar de contenido sin que se vea (s). */
  holdS: 0.06,

  /**
   * `power1.inOut` es el equivalente en GSAP de la curva del efecto original
   * (`cubic-bezier(0.455, 0.03, 0.515, 0.955)`, que es easeInOutQuad).
   */
  ease: 'power1.inOut',
} as const;
